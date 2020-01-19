const envConfig = require('dotenv').config();
/*
 * Netlify dev currently don't allow to override environment variables.
 * This is a workaround until such functionality is implemented. More Info:
 * https://github.com/netlify/cli/issues/474#issuecomment-554108903
 */
if (envConfig.parsed) {
	Object.entries(envConfig.parsed).forEach(([key, value]) => {
		process.env[key] = value;
	});
}

const Telegraf = require('telegraf');
const { Database } = require('./components/database/Database');
const { WCHelper } = require('./components/WCHelper');
const startAction = require('./actions/start');
const enableNotificationsAction = require('./actions/enableNotifications');
const disableNotificationsAction = require('./actions/disableNotifications');

console.log(`Database Version: ${Database.VERSION}`);

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
// enable @username commands in group chats
bot.telegram.getMe().then(botInfo => {
	bot.options.username = botInfo.username;
});

const db = new Database();
const wc = new WCHelper(bot, db);

bot.context.db = db;
bot.context.wc = wc;

bot.start(async ctx => {
	await ctx.db.setup();
	return startAction(ctx);
});

exports.handler = async event => {
	// WooCommerce webhook
	if ('x-wc-webhook-topic' in event.headers) {
		console.log(`${event.headers['x-wc-webhook-topic']} received`);
		switch (event.headers['x-wc-webhook-topic']) {
			case 'order.created':
				await wc.handleOrderCreated(JSON.parse(event.body));
				break;
			default:
				console.log(
					`Webhook ${event.headers['x-wc-webhook-topic']} handler not defined.`,
				);
				break;
		}

		return { statusCode: 200, body: '' };
	}

	// WooCommerce webhook test call on creation.
	if (event.body.startsWith('webhook_id')) {
		return { statusCode: 200, body: 'Webhook successfully set.' };
	}

	// handle telegram updates.
	await bot.handleUpdate(JSON.parse(event.body));

	return { statusCode: 200, body: '' };
};

bot.command('chatid', async ctx => {
	return ctx.reply(`The chat ID for this chat is: ${ctx.chat.id}`);
});

bot.command('enablenotifications', async ctx => {
	return enableNotificationsAction(ctx);
});

bot.command('disablenotifications', async ctx => {
	return disableNotificationsAction(ctx);
});
