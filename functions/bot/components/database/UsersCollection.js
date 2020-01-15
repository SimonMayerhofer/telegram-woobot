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

	async addUser(user) {
		console.log(`Add user ${user.id}`);
		const { client, q } = this;
		const userCount = await this.getUserCount();

		return new Promise((res, rej) => {
			client
				.query(
					q.Create(q.Collection(this.getName()), {
						data: {
							id: user.id,
							firstName: user.firstName,
							lastName: user.lastName,
							role: userCount === 0 ? 'admin' : '',
							username: user.username,
						},
					}),
				)
				.then(() => {
					res(userCount === 0 ? 'first user added' : 'user added');
				})
				.catch(err => {
					rej(err);
				});
		});
	}

	async getUserCount() {
		console.log(`Get user count`);
		const { client, q } = this;
		return new Promise((res, rej) => {
			client
				.query(
					q.Count(
						q.Map(
							q.Paginate(q.Match(q.Index(this.getAllIndexName()))),
							q.Lambda('X', q.Get(q.Var('X'))),
						),
					),
				)
				.then(ret => {
					res(ret.data[0]);
				})
				.catch(err => {
					console.log(err);
				});
		});
	}

	async isUserAdmin(id) {
		console.log(`Check if user "${id}" is admin.`);
		const { client, q } = this;

		return new Promise((res, rej) => {
			client
				.query(
					q.Map(
						q.Paginate(q.Match(q.Index(this.getSearchByIdIndexName()), id)),
						q.Lambda('X', q.Get(q.Var('X'))),
					),
				)
				.then(ret => {
					if (ret.data.length !== 0) {
						console.log(`* User ${id} found.`);
						res(ret.data[0].data.role === 'admin');
					}
					rej(new Error('user not found'));
				});
		});
	}
}

exports.UsersCollection = UsersCollection;
