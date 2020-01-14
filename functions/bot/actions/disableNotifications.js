const { getOption, setOption, isUserAdmin } = require('../components/fauna');

module.exports = async ctx => {
	const isAdmin = await isUserAdmin(ctx.from.id);

	if (isAdmin) {
		const notificationChats = await getOption('notificationChats', []);
		const newNotifyChats = [];

		// check if chat already in notifications list.
		notificationChats.forEach(chat => {
			if (chat.id !== ctx.chat.id) {
				newNotifyChats.push(chat);
			}
		});

		await setOption('notificationChats', newNotifyChats);
		return ctx.reply(`Notifications disabled`);
	}

	return ctx.reply(`You don't have permissions to run this command.`);
};
