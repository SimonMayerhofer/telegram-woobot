const faunadb = require('faunadb');

const client = new faunadb.Client({
	secret:
		process.env.NODE_ENV !== 'production'
			? process.env.FAUNA_SECRET_KEY_DEV
			: process.env.FAUNA_SECRET_KEY,
});
const q = faunadb.query;

async function getUserCount() {
	return new Promise((res, rej) => {
		client
			.query(
				q.Count(
					q.Map(
						q.Paginate(q.Match(q.Index('all_users'))),
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

exports.newUser = async user => {
	const userCount = await getUserCount();

	return new Promise((res, rej) => {
		client
			.query(
				q.Create(q.Collection('users'), {
					data: {
						userId: user.id,
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
};

async function optionExists(key) {
	console.log(`* Check if option "${key}" exists.`);

	return new Promise((res, rej) => {
		client
			.query(
				q.Map(
					q.Paginate(q.Match(q.Index('options_search_by_key'), key)),
					q.Lambda('X', q.Get(q.Var('X'))),
				),
			)
			.then(ret => {
				console.log(`* Option ${ret.data.length === 0 ? 'not ' : ''}found.`);
				res(ret.data.length !== 0);
			});
	});
}

exports.setOption = async (key, value) => {
	console.log(`Set option "${key}".`);
	const exists = await optionExists(key);

	if (exists) {
		console.log('* key exists. update key.');
		return new Promise((res, rej) => {
			client
				.query(
					q.Update(
						q.Select(
							'ref',
							q.Get(q.Match(q.Index('options_search_by_key'), key)),
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
				q.Create(q.Collection('options'), {
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
};

exports.getOption = async (key, defaultValue) => {
	console.log(`Get option by key: "${key}"`);

	return new Promise((res, rej) => {
		client
			.query(
				q.Map(
					q.Paginate(q.Match(q.Index('options_search_by_key'), key)),
					q.Lambda('X', q.Get(q.Var('X'))),
				),
			)
			.then(ret => {
				if (ret.data.length === 0) {
					console.log(`* No option found. Return default value.`);
					res(defaultValue);
				}

				console.log(`* Option found.`);
				res(ret.data[0].data.value);
			});
	});
};
