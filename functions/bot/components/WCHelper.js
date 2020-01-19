const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

class WCHelper {
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
	}
}

exports.WCHelper = WCHelper;
