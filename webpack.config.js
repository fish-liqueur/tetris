const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            '@game': path.resolve(__dirname, 'src/game/'),
        },
    },
    devServer: {
        static: [
            {
                directory: path.join(__dirname),
            },
        ],
    },
};