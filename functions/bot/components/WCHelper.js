const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const Telegram = require('telegraf/telegram');
const { formatCurrency } = require('./helper');

class WCHelper {
	constructor(bot, database) {
		this.api = new WooCommerceRestApi({
			url: process.env.WC_SITE_URL,
			consumerKey: process.env.WC_CONSUMER_KEY,
			consumerSecret: process.env.WC_CONSUMER_SECRET,
			version: 'wc/v3',
		});

		this.bot = bot;
		this.db = database;
		this.tg = new Telegram(process.env.TELEGRAM_BOT_TOKEN);
	}

	async handleOrderCreated(order) {
		const {
			id,
			currency_symbol: currency,
			customer_note: note,
			billing,
			payment_method: paymentMethod,
			line_items: products,
			coupon_lines: coupons,
			refunds,
			shipping_total: shippingTotal,
			total_tax: totalTax,
		} = order;

		let { total } = order;
		let shipping = parseFloat(shippingTotal);
		shipping = Number.isNaN(shipping) ? 0 : shipping;

		// net total.
		total = parseFloat(total) - parseFloat(shipping) - parseFloat(totalTax);

		let text = `<b>💰New Order (#${id})</b>`;

		// Total: 465.03€
		text += `\nTotal net: ${formatCurrency(total, currency)}`;

		// Company Inc., John Doe
		text += `\n${
			billing.company ? `${billing.company}, ` : ''
		}${`${billing.first_name} ${billing.last_name}`}`;

		// products
		text += `\nProducts:`;
		products.forEach(p => {
			text += `\n- ${p.quantity}x ${p.name}`;
		});

		// Coupon: ...
		if (coupons.length > 0) {
			text += `\nCoupon${coupons.length > 1 ? 's' : ''}: `;
			coupons.forEach(c => {
				text += `${c.code}`;
			});
		}

		// Customer Note: ...
		if (note) {
			text += `\nCustomer Note: ${note}`;
		}

		const notificationChats = await this.db.getOption('notificationChats', []);
		const messagePromises = [];

		notificationChats.forEach(chat => {
			messagePromises.push(
				this.tg.sendMessage(chat.id, text, {
					parse_mode: 'HTML',
				}),
			);
		});

		return Promise.all(messagePromises);
	}
}

exports.WCHelper = WCHelper;
