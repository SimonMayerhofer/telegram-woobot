const faunadb = require('faunadb');

const client = new faunadb.Client({
	secret:
		process.env.NODE_ENV !== 'production'
			? process.env.FAUNA_SECRET_KEY_DEV
			: process.env.FAUNA_SECRET_KEY,
});
const q = faunadb.query;

exports.newUser = id => {
	return new Promise((res, rej) => {
		client
			.query(q.Create(q.Collection('user'), { data: { userId: id } }))
			.then(ret => {
				console.log(ret);
				res(true);
			})
			.catch(err => {
				console.log(err);
				rej(err);
			});
	});
};
