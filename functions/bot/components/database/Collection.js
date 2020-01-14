class Collection {
	constructor(client, query) {
		this.client = client;
		this.q = query;
	}

	/**
	 * Returns name of collection.
	 */
	getName() {
		return this.name;
	}

	/**
	 * Returns name of all index.
	 */
	getAllIndexName() {
		return `${this.name}_all`;
	}

	async createCollection() {
		console.log(`\nCreate collection ${this.getName()}`);

		const { client, q } = this;
		return new Promise((res, rej) => {
			client
				.query(q.CreateCollection({ name: this.getName() }))
				.then(() => {
					console.log('* successfully created');
					res();
				})
				.catch(err => {
					rej(err);
				});
		});
	}

	async collectionExists() {
		console.log(`* check if collection ${this.getName()} exists.`);

		const { client, q } = this;

		return new Promise((res, rej) => {
			client
				.query(q.Paginate(q.Collections()))
				.then(ret => {
					let exists = false;
					ret.data.forEach(collection => {
						if (collection.id === this.getName()) {
							exists = true;
						}
					});
					console.log(
						`* collection ${exists ? 'already exists' : 'does not exist'}.`,
					);
					res(exists);
				})
				.catch(err => {
					console.log(err);
					rej(err);
				});
		});
	}

	async createAllIndex() {
		console.log(`* create index ${this.getAllIndexName()}`);

		const { client, q } = this;

		return new Promise((res, rej) => {
			client
				.query(
					q.CreateIndex({
						name: `${this.getAllIndexName()}`,
						source: q.Collection(this.getName()),
						serialized: true,
					}),
				)
				.then(() => {
					console.log('* successfully created');
					res();
				})
				.catch(err => {
					rej(err);
				});
		});
	}

	async allIndexExists() {
		console.log(`* check if index ${this.getAllIndexName()} exists.`);

		const { client, q } = this;

		return new Promise((res, rej) => {
			client
				.query(q.Paginate(q.Indexes()))
				.then(ret => {
					let exists = false;
					ret.data.forEach(index => {
						if (index.id === `${this.getAllIndexName()}`) {
							exists = true;
						}
					});
					console.log(
						`* index ${exists ? 'already exists' : 'does not exist'}.`,
					);
					res(exists);
				})
				.catch(err => {
					console.log(err);
					rej(err);
				});
		});
	}

	async setup() {
		console.log(`\nSetup collection ${this.getName()}`);

		const collExists = await this.collectionExists();
		if (!collExists) {
			await this.createCollection();
		}

		const allIndexExists = await this.allIndexExists();
		if (!allIndexExists) {
			await this.createAllIndex();
		}
	}
}

exports.Collection = Collection;
