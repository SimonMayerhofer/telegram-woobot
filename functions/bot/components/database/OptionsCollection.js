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

	async getOption(key, defaultValue) {
		console.log(`Get option by key: "${key}"`);
		const { client, q } = this;

		return new Promise((res, rej) => {
			client
				.query(
					q.Map(
						q.Paginate(q.Match(q.Index(this.getSearchByKeyIndexName()), key)),
						q.Lambda('X', q.Get(q.Var('X'))),
					),
				)
				.then(ret => {
					if (ret.data.length === 0) {
						console.log(`* No option found. Return default value.`);
						res(defaultValue);
					} else {
						console.log(`* Option found.`);
						res(ret.data[0].data.value);
					}
				});
		});
	}

	async optionExists(key) {
		console.log(`Check if option "${key}" exists.`);
		const { client, q } = this;

		return new Promise((res, rej) => {
			client
				.query(
					q.Map(
						q.Paginate(q.Match(q.Index(this.getSearchByKeyIndexName()), key)),
						q.Lambda('X', q.Get(q.Var('X'))),
					),
				)
				.then(ret => {
					console.log(`* Option ${ret.data.length === 0 ? 'not ' : ''}found.`);
					res(ret.data.length !== 0);
				});
		});
	}

	async setOption(key, value) {
		console.log(`Set option "${key}".`);
		const { client, q } = this;
		const exists = await this.optionExists(key);

		if (exists) {
			console.log('* key exists. update key.');
			return new Promise((res, rej) => {
				client
					.query(
						q.Update(
							q.Select(
								'ref',
								q.Get(q.Match(q.Index(this.getSearchByKeyIndexName()), key)),
							),
							{
								data: {
									key,
									value,
								},
							},
						),
					)
					.then(ret => {
						console.log('* key updated.');
						res(ret);
					})
					.catch(err => {
						console.log('* update failed.');
						rej(err);
					});
			});
		}

		return new Promise((res, rej) => {
			client
				.query(
					q.Create(q.Collection(this.getName()), {
						data: {
							key,
							value,
						},
					}),
				)
				.then(ret => {
					console.log('* new key set.');
					res(ret);
				})
				.catch(err => {
					console.log('* new key set failed.');
					rej(err);
				});
		});
	}
}

exports.OptionsCollection = OptionsCollection;
