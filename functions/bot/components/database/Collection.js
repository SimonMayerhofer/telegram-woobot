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

	async setup() {
		console.log(`\nSetup collection ${this.getName()}`);

		const exists = await this.collectionExists();

		if (!exists) {
			await this.createCollection();
		}
	}
}

exports.Collection = Collection;
