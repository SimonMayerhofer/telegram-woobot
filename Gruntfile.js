require('dotenv').config();

/* eslint import/no-dynamic-require:0 */
/* eslint global-require:0 */
/* eslint-disable-next-line func-names */
module.exports = function(grunt) {
	// Utility to load the different option files
	// based on their names
	function loadConfig(path) {
		const glob = require('glob');
		const object = {};
		let key;
		glob.sync('*', { cwd: path }).forEach(option => {
			key = option.replace(/\.js$/, '');
			object[key] = require(path + option);
		});
		return object;
	}

	// Initial config
	const config = {
		pkg: grunt.file.readJSON('package.json'),
		env: process.env,
		paths: {
			// Files which should be prettified with Prettier.
			prettier: {
				files_std: [
					// Standard file match
					'<%= paths.js.files %>',
					'<%= paths.json.files %>',
				],
				files: '<%= paths.prettier.files_std %>', // Dynamic file match
			},

			// JavaScript assets
			js: {
				files_std: [
					// Standard file match
					'**/*.js',
					'!node_modules/**/*.js',
				],
				files: '<%= paths.js.files_std %>', // Dynamic file match
			},

			// JSON assets
			json: {
				files_std: [
					// Standard file match
					'**/*.json',
					'.eslintrc',
					'.prettierrc',
					'!package-lock.json',
					'!node_modules/**/*.json',
				],
				files: '<%= paths.json.files_std %>', // Dynamic file match
			},
		},
	};

	// Load tasks from the tasks folder
	grunt.loadTasks('tasks');

	// Load all task options in tasks/options
	grunt.util._.extend(config, loadConfig('./tasks/options/'));

	grunt.initConfig(config);

	grunt.event.on('watch', (action, filepath) => {
		// Determine task based on filepath
		function getExt(path) {
			let ret = '';
			const i = path.lastIndexOf('.');
			if (i !== -1 && i <= path.length) {
				ret = path.substr(i + 1);
			}
			return ret;
		}

		switch (getExt(filepath)) {
			// JavaScript
			case 'js':
				grunt.config('paths.js.files', [filepath]);
				grunt.config('paths.prettier.files', [filepath]);
				break;
			// JSON
			case 'json':
			case 'eslintrc':
			case 'prettierrc':
				grunt.config('paths.json.files', [filepath]);
				grunt.config('paths.prettier.files', [filepath]);
				break;
			default:
				break;
		}
	});

	// loads any tasks listed in devDependencies in package.json
	require('load-grunt-tasks')(grunt);
};
