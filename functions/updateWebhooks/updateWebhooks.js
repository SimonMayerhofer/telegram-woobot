/**
 * Update Webhooks function to update shop + bot webhooks after deploying.
 */

require('dotenv').config();
const request = require('request');
const { WCWebhookHelper } = require('./components/WCWebhookHelper');

exports.handler = async event => {
	try {
		const wc = new WCWebhookHelper();
		await wc.updateWebhooks();

		const botToken =
			process.env.NODE_ENV !== 'production'
				? process.env.TELEGRAM_BOT_TOKEN_DEV
				: process.env.TELEGRAM_BOT_TOKEN;

		request.post(
			`https://api.telegram.org/bot${botToken}/setWebhook?url=${process.env.URL}/api/bot`,
			{ json: {} },
			function(error, response, body) {
				if (!error && response.statusCode === 200) {
					console.log(body);
				} else {
					console.log(error);
					throw error;
				}
			},
		);
	} catch (e) {
		return { statusCode: 500, body: e.message };
	}

	return { statusCode: 200, body: 'Webhooks successfully updated.' };
};
