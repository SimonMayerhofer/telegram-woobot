module.exports = {
	updateBotWebhook: {
		command: [
			'echo Please enter Netlify Dev .live URL:',
			'read webhook',
			`echo Update Bot Webhook...`,
			`curl --fail https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN_DEV}/setWebhook -F "url=$webhook/.netlify/functions/bot"`,
		].join('&&'),
	},
};
