const { Collection } = require('./Collection');

class UsersCollection extends Collection {
	constructor(client, query) {
		super(client, query);
		this.name = 'users';
	}
}

exports.UsersCollection = UsersCollection;
