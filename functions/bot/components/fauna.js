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
						q.Paginate(q.Match(q.Index('all_user'))),
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

exports.newUser = async id => {
	const userCount = await getUserCount();

	return new Promise((res, rej) => {
		client
			.query(
				q.Create(q.Collection('user'), {
					data: {
						userId: id,
						role: userCount === 0 ? 'admin' : '',
					},
				}),
			)
			.then(ret => {
				console.log(ret);
				res(userCount === 0 ? 'first user added' : 'user added');
			})
			.catch(err => {
				rej(err);
			});
	});
};
