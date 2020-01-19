/**
 * Update Webhooks function to update shop + bot webhooks after deploying.
 */

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

const request = require('request');
const { WCWebhookHelper } = require('./components/WCWebhookHelper');

exports.handler = async event => {
	try {
		console.log('Update WooCommerce webhooks.');
		const wc = new WCWebhookHelper();
		await wc.updateWebhooks();

		console.log('Update Telegram webhook.');
		request.post(
			`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook?url=${process.env.URL}/api/bot`,
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
		console.log('* Error: ', e.message);
		return { statusCode: 500, body: e.message };
	}

	return { statusCode: 200, body: 'Webhooks successfully updated.' };
};
