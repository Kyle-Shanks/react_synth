const path = require('path');

module.exports = {
    entry: 'frontend/ReactSynth.jsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'
                    ],
                }
            },
        ],
    },
    resolve: {
        extensions: ['.jsx', '.js'],
        alias: {
            dist: path.join(__dirname, './dist'),
            frontend: path.join(__dirname, './frontend'),
        },
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
    },
};
