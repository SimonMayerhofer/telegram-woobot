const { Collection } = require('./Collection');

class OptionsCollection extends Collection {
	constructor(client, query) {
		super(client, query);
		this.name = 'options';
	}

	/**
	 * Returns name of search by key index.
	 */
	getSearchByKeyIndexName() {
		return `${this.name}_search_by_key`;
	}

	async setup() {
		await super.setup();

		const searchByKeyIndexExists = await this.indexExists(
			this.getSearchByKeyIndexName(),
		);
		if (!searchByKeyIndexExists) {
			await this.createIndex({
				name: `${this.getSearchByKeyIndexName()}`,
				source: this.q.Collection(this.getName()),
				unique: true,
				serialized: true,
				terms: [{ field: ['data', 'key'] }],
			});
		}
	}
}

exports.OptionsCollection = OptionsCollection;
