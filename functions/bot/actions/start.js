const { newUser } = require('../components/fauna');
const { getUser } = require('../components/helper');

module.exports = async ctx => {
	const { id, isBot, name } = getUser(ctx.from);

	if (isBot) {
		return ctx.reply(`Sorry I only interact with humans!`);
	}

	try {
		const isNewUser = await newUser(id);
		if (isNewUser === true) {
			return ctx.reply(`Added ${name} to db!`);
		}
		if (isNewUser instanceof Error) {
			return ctx.reply(isNewUser.message);
		}
		return ctx.reply(`Unknown error. Please try again.`);
	} catch (e) {
		return ctx.reply(`Error occured`);
	}
};
