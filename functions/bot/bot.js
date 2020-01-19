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

bot.context.db = new Database();
bot.context.wc = new WCHelper();

bot.start(async ctx => {
	await ctx.db.setup();
	return startAction(ctx);
});

exports.handler = async event => {
	// webhook test call is not JSON, would throw an error.
	if (!event.body.startsWith('webhook_id')) {
		await bot.handleUpdate(JSON.parse(event.body));
	}
	return { statusCode: 200, body: '' };
};

bot.command('chatId', async ctx => {
	return ctx.reply(`The chat ID for this chat is: ${ctx.chat.id}`);
});

bot.command('enableNotifications', async ctx => {
	return enableNotificationsAction(ctx);
});

bot.command('disableNotifications', async ctx => {
	return disableNotificationsAction(ctx);
});
