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

	async createIndex(paramObj) {
		console.log(`* create index ${paramObj.name}`);

		const { client, q } = this;

		return new Promise((res, rej) => {
			client
				.query(q.CreateIndex(paramObj))
				.then(ret => {
					console.log('* successfully created');
					res(ret);
				})
				.catch(err => {
					rej(err);
				});
		});
	}

	async indexExists(name) {
		console.log(`* check if index ${name} exists.`);

		const { client, q } = this;

		return new Promise((res, rej) => {
			client
				.query(q.Paginate(q.Indexes()))
				.then(ret => {
					let exists = false;
					ret.data.forEach(index => {
						if (index.id === name) {
							exists = true;
						}
					});
					console.log(
						`* ${name} ${exists ? 'already exists' : 'does not exist'}.`,
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

		const allIndexExists = await this.indexExists(this.getAllIndexName());
		if (!allIndexExists) {
			await this.createIndex({
				name: `${this.getAllIndexName()}`,
				source: this.q.Collection(this.getName()),
				serialized: true,
			});
		}
	}
}

exports.Collection = Collection;
