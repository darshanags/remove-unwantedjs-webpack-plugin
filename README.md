# remove-unwantedjs-webpack-plugin
A [Webpack](https://webpack.js.org/) plugin that automatically removes .js files created as a by-product when the entry is a sass/scss file.

## Installation
    npm install remove-unwantedjs-webpack-plugin --save-dev
## Usage

    // webpack.config.js
    ...
    const RemoveUnwantedJsWebpackPlugin = require('remove-unwantedjs-webpack-plugin');
    ...
    const config = [{
	...
	  plugins: [
		new RemoveUnwantedJsWebpackPlugin()
	  ]
	...
	}];
	module.exports = config;
