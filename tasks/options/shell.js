module.exports = {
	updateWebhooks: {
		command: process.env.URL
			? [
					`echo Update Bot Webhook...`,
					`curl -sSf https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN_DEV}/setWebhook -F "url=${process.env.URL}/api/bot" > /dev/null`,
					`echo Update Shop Webhooks...`,
					`curl -sSf ${process.env.URL}/api/updateShopWebhooks > /dev/null`,
			  ].join('&&')
			: [
					'echo Please enter Netlify Dev .live URL:',
					'read url',
					`echo Update Bot Webhook...`,
					`curl -sSf https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN_DEV}/setWebhook -F "url=$url/api/bot" > /dev/null`,
					`echo Update Shop Webhooks...`,
					`curl -sSf $url/api/updateShopWebhooks > /dev/null`,
			  ].join('&&'),
	},
};
