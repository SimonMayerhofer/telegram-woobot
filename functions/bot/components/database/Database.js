const faunadb = require('faunadb');
const { UsersCollection } = require('./UsersCollection');
const { OptionsCollection } = require('./OptionsCollection');

class Database {
	constructor() {
		this.client = new faunadb.Client({
			secret:
				process.env.CONTEXT !== 'production'
					? process.env.FAUNA_SECRET_KEY_DEV
					: process.env.FAUNA_SECRET_KEY,
		});
		this.query = faunadb.query;
		this.users = new UsersCollection(this.client, this.query);
		this.options = new OptionsCollection(this.client, this.query);
	}

	async setup() {
		console.log('Start database setup.');
		await this.users.setup();
		await this.options.setup();
	}

	/* Users */

	async addUser(user) {
		return this.users.addUser(user);
	}

	async getUserCount() {
		return this.users.getUserCount();
	}

	async isUserAdmin(id) {
		return this.users.isUserAdmin(id);
	}

	/* Options */

	async getOption(key, defaultValue) {
		return this.options.getOption(key, defaultValue);
	}

	async optionExists(key) {
		return this.options.optionsExists(key);
	}

	async setOption(key, value) {
		return this.options.setOption(key, value);
	}
}

Database.VERSION = 1;

exports.Database = Database;
