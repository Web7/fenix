const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
	entry: './src/css/common.css',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								use: [{
									loader: 'postcss-loader',
									options: {
										minimize: true
									}
								}],
								minimize: true,
								url: false
							}
						}
					]
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('common.css'),
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano'),
			cssProcessorPluginOptions: {discardComments: { removeAll: true }},
			canPrint: true
		})
	]
};