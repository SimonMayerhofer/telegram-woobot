module.exports = {
	options: {
		spawn: false,
	},

	scripts: {
		files: ['<%= paths.js.files_std %>'],
		tasks: ['prettier', 'eslint:fix'],
	},

	json: {
		files: ['<%= paths.json.files_std %>'],
		tasks: ['prettier'],
	},
};
