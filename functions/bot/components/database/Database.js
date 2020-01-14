const faunadb = require('faunadb');
const { UsersCollection } = require('./UsersCollection');
const { OptionsCollection } = require('./OptionsCollection');

class Database {
	constructor() {
		this.client = new faunadb.Client({
			secret:
				process.env.NODE_ENV !== 'production'
					? process.env.FAUNA_SECRET_KEY_DEV
					: process.env.FAUNA_SECRET_KEY,
		});
		this.query = faunadb.query;
	}

	async setup() {
		console.log('Start database setup.');

		const users = new UsersCollection(this.client, this.query);
		await users.setup();

		const options = new OptionsCollection(this.client, this.query);
		await options.setup();
	}
}

Database.VERSION = 1;

exports.Database = Database;
