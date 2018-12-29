const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = [
    {
        entry: './src/index.js',
        output: {
            filename: 'key.pics.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: "var",
            library: "KeyPics"
        },
        optimization: {
            minimize: false
        }
    },
    {
        entry: './src/index.js',
        devtool: "source-map",
        output: {
            filename: 'key.pics.min.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: "var",
            library: "KeyPics"
        },
        optimization: {
            minimize: true
        }
    }
];