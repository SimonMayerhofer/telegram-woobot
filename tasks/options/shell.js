module.exports = {
	updateWebhooks: {
		command: process.env.URL
			? [
					`echo Update bot + shop webhooks...`,
					`curl -sSf ${process.env.URL}/api/updateWebhooks > /dev/null`,
			  ].join('&&')
			: [
					'echo Please enter Netlify Dev .live URL:',
					'read url',
					`echo Update bot + shop webhooks...`,
					`curl -sSf $url/api/updateWebhooks > /dev/null`,
			  ].join('&&'),
	},
};
