const {defineConfig} = require('@vue/cli-service')
const webpack = require('webpack');

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        headers: { 'Access-Control-Allow-Origin': 'http://localhost:8000' , 'Access-Control-Allow-Credentials': 'true'},
        proxy: 'http://localhost:8000',
    },
    configureWebpack: {
        devServer: {
            headers: { 'Access-Control-Allow-Origin': '*' }
        },
        plugins: [
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser',
            })
        ],
        resolve: {
            fallback: {
                "https": require.resolve("https-browserify"),
                "http": require.resolve("stream-http"),
                "crypto": require.resolve("crypto-browserify"),
                "assert": require.resolve("assert/"),
                "stream": require.resolve("stream-browserify")
            }
        }
    }
})
