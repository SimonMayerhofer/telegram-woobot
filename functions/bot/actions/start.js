const { newUser } = require('../components/fauna');
const { getUser } = require('../components/helper');

module.exports = async ctx => {
	const { id, isBot, name } = getUser(ctx.from);

	if (isBot) {
		return ctx.reply(`Sorry I only interact with humans!`);
	}

	try {
		const response = await newUser(id);

		if (response === 'first user added') {
			return ctx.reply(`Hi ${name}! As the first user, you are the admin now.`);
		}
		if (response === 'user added') {
			return ctx.reply(`Hi ${name}!`);
		}
		return ctx.reply(`Unknown error: `);
	} catch (e) {
		// User already in the database.
		if (e.message === 'instance not unique') {
			return ctx.reply(`Hi ${name}!`);
		}
		return ctx.reply(`Error occured: ${e.message}`);
	}
};
