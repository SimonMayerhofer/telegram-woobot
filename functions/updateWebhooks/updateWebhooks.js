/**
 * Update Webhooks function to update shop + bot webhooks after deploying.
 */

require('dotenv').config();
const request = require('request');
const { WCWebhookHelper } = require('./components/WCWebhookHelper');

exports.handler = async event => {
	try {
		console.log('Update WooCommerce webhooks.');
		const wc = new WCWebhookHelper();
		await wc.updateWebhooks();

		const botToken =
			process.env.CONTEXT !== 'production'
				? process.env.TELEGRAM_BOT_TOKEN_DEV
				: process.env.TELEGRAM_BOT_TOKEN;

		console.log('Update Telegram webhook.');
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
		console.log('Error: ', e);
		return { statusCode: 500, body: e.message };
	}

	return { statusCode: 200, body: 'Webhooks successfully updated.' };
};
