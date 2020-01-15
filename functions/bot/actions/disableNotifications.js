module.exports = async ctx => {
	const { db } = ctx;
	const isAdmin = await db.isUserAdmin(ctx.from.id);

	if (isAdmin) {
		const notificationChats = await db.getOption('notificationChats', []);
		const newNotifyChats = [];

		// check if chat already in notifications list.
		notificationChats.forEach(chat => {
			if (chat.id !== ctx.chat.id) {
				newNotifyChats.push(chat);
			}
		});

		await db.setOption('notificationChats', newNotifyChats);
		return ctx.reply(`Notifications disabled`);
	}

	return ctx.reply(`You don't have permissions to run this command.`);
};
