const fs = require('fs');
const path = require('path');

class RemoveUnwantedJsWebpackPlugin {

	constructor(config = {}) {
		this._defaults = {
			ext: '.js'
		}

		this.config = Object.assign({}, this._defaults, config);
	}

	apply(compiler) {
		compiler.hooks.afterEmit.tap('RemoveUnwantedJsWebpackPlugin', (compilation) => {

			let assetsArr = compilation.getStats().toJson().assets;
			let outputPath = compilation.options.output.path;
			let entry = compilation.options.entry;
			let entryType = getType(entry);
			let found, toClean;


			switch (entryType) {
				case 'string':
					if (!isSS(entry)) {
						return;
					}
					break;
				case 'array':

					found = findNonSSInArray(entry);

					if (found) {
						return;
					}

					break;
				case 'object':
					toClean = processObject(entry);
					break;
			}

			for (let asset of assetsArr) {

				if (toClean != undefined) { // clean if entry was an Object

					for (let entry of toClean) {
						if (asset.name == entry + '.js') {
							try {
								fs.unlinkSync(outputPath + '/' + asset.name) // delete physical file
								delete compilation.assets[asset.name] // clean up webpack output
							} catch (error) {

							}
						}
					}

				} else { // clean if entry was a string or array

					if (asset.name.endsWith(this.config.ext)) {
						try {
							fs.unlinkSync(outputPath + '/' + asset.name) // delete physical file
							delete compilation.assets[asset.name] // clean up webpack output
						} catch (error) {

						}
					}

				}

			}; // end: asset loop

		}); // end: afterEmit hook

	} // end: apply
}

// we don't need to export the following

function getType(entry) {
	let type;

	if (typeof entry == 'string') {
		type = 'string';
	} else if (Array.isArray(entry)) {
		type = 'array';
	} else if (entry instanceof Object) {
		type = 'object';
	}


	return type;

}

function isSS(str) {
	const regex = /s?(?:c|a)ss$/gi;

	return (str.match(regex) !== null);
}

function findNonSSInArray(arr) {

	let result,
		found = false;

	result = arr.find((element) => {
		return !isSS(element);
	});

	if (result !== undefined) {
		found = true
	}

	return found;
}

function processObject(obj) {
	const keys = Object.keys(obj);
	let cleanThese = [];
	let value, type;

	for (let key of keys) {
		value = obj[key];
		type = getType(value);

		if (type == 'string' && isSS(value)) {
			cleanThese.push(key);
		} else if (type == 'array' && !findNonSSInArray(value)) {
			cleanThese.push(key);
		}
	}

	return cleanThese;
}

module.exports = RemoveUnwantedJsWebpackPlugin;