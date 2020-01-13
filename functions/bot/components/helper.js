exports.getUser = info => {
	const {
		id,
		is_bot: isBot,
		first_name: firstName,
		last_name: lastName,
		username,
	} = info;

	return { id, isBot, firstName, lastName, username };
};
