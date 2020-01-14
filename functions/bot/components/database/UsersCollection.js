const { Collection } = require('./Collection');

class UsersCollection extends Collection {
	constructor(client, query) {
		super(client, query);
		this.name = 'users';
	}

	/**
	 * Returns name of search by id index.
	 */
	getSearchByIdIndexName() {
		return `${this.name}_search_by_id`;
	}

	async setup() {
		await super.setup();

		const searchByIdIndexExists = await this.indexExists(
			this.getSearchByIdIndexName(),
		);
		if (!searchByIdIndexExists) {
			await this.createIndex({
				name: `${this.getSearchByIdIndexName()}`,
				source: this.q.Collection(this.getName()),
				unique: true,
				serialized: true,
				terms: [{ field: ['data', 'id'] }],
			});
		}
	}
}

exports.UsersCollection = UsersCollection;
