require('dotenv').config();
const Telegraf = require('telegraf');
const startAction = require('./actions/start');
const enableNotificationsAction = require('./actions/enableNotifications');
const disableNotificationsAction = require('./actions/disableNotifications');

const bot = new Telegraf(
	process.env.NODE_ENV !== 'production'
		? process.env.TELEGRAM_BOT_TOKEN_DEV
		: process.env.TELEGRAM_BOT_TOKEN,
);

bot.start(ctx => {
	return startAction(ctx);
});

exports.handler = async event => {
	await bot.handleUpdate(JSON.parse(event.body));
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
