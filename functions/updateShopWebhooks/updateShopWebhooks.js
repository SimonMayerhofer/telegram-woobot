require('dotenv').config();
const { WCHelper } = require('../bot/components/WCHelper');

exports.handler = async event => {
	const wc = new WCHelper();
	await wc.updateWebhooks();
	return { statusCode: 200, body: '' };
};
