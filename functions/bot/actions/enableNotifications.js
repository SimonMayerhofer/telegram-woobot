module.exports = async ctx => {
	const { db } = ctx;
	const isAdmin = await db.isUserAdmin(ctx.from.id);

	if (isAdmin) {
		const notificationChats = await db.getOption('notificationChats', []);
		let isEnabled = false;

		// check if chat already in notifications list.
		notificationChats.forEach(chat => {
			if (chat.id === ctx.chat.id) {
				isEnabled = true;
			}
		});

		if (isEnabled) {
			return ctx.reply(`Notifications already enabled`);
		}

		await db.setOption('notificationChats', [
			...notificationChats,
			...[ctx.chat],
		]);
		return ctx.reply(`Notifications enabled`);
	}

	return ctx.reply(`You don't have permissions to run this command.`);
};
