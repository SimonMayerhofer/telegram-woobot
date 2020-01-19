const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

class WCWebhookHelper {
	constructor() {
		this.api = new WooCommerceRestApi(
			process.env.CONTEXT !== 'production'
				? {
						url: process.env.WC_SITE_URL_DEV,
						consumerKey: process.env.WC_CONSUMER_KEY_DEV,
						consumerSecret: process.env.WC_CONSUMER_SECRET_DEV,
						version: 'wc/v3',
				  }
				: {
						url: process.env.WC_SITE_URL,
						consumerKey: process.env.WC_CONSUMER_KEY,
						consumerSecret: process.env.WC_CONSUMER_SECRET,
						version: 'wc/v3',
				  },
		);

		this.webhookPrefix = 'Telegram WooBot';
	}

	/**
	 * Update webhooks to current bot function URL.
	 */
	async updateWebhooks() {
		console.log('\nUpdating webhooks');
		console.log('* get existing webhooks from site...');
		const webhooks = await new Promise((res, rej) => {
			this.api
				.get('webhooks', {
					search: this.webhookPrefix,
				})
				.then(response => {
					res(response.data);
				})
				.catch(error => {
					console.log(`* Error: ${error.response.message}`);
					rej(error);
				});
		});

		console.log(`* ${webhooks.length} webhooks found.`);

		const update = [];
		const create = [];

		// update existing webhooks.
		webhooks.forEach(wh => {
			update.push({
				id: wh.id,
				topic: wh.topic,
				delivery_url: `${process.env.URL}/api/bot`,
			});
			console.log(`* update ${wh.topic} webhook`);
		});

		// check if webhook with topic already exists.
		const exists = topic => update.find(wh => wh.topic === topic);

		// needed webhook topics.
		const topics = ['order.created'];

		// add webhooks if not already exists.
		topics.forEach(topic => {
			if (!exists(topic)) {
				create.push({
					name: `${this.webhookPrefix} ${topic}`,
					topic,
					delivery_url: `${process.env.URL}/api/bot`,
				});
				console.log(`* create '${topic}' webhook`);
			}
		});

		console.log(`* send webhooks update batch to site...`);

		const batch = await new Promise((res, rej) => {
			this.api
				.post('webhooks/batch', {
					create,
					update,
				})
				.then(response => {
					console.log('* successfully updated.');
					res(response.data);
				})
				.catch(error => {
					console.log(`* Error: ${error.response.message}`);
					rej(error);
				});
		});
	}
}

exports.WCWebhookHelper = WCWebhookHelper;
