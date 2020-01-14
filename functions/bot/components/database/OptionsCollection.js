const { Collection } = require('./Collection');

class OptionsCollection extends Collection {
	constructor(client, query) {
		super(client, query);
		this.name = 'options';
	}
}

exports.OptionsCollection = OptionsCollection;
