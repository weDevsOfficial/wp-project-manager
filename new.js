const path = require('path');



module.exports = {
    entry: {
        bundle: './views/assets/js/pm.js',
        library: './views/assets/js/pm-library.js',
    },

    output: {
        path: path.resolve( __dirname, 'views/assets/js'),
        filename: '[name].js',
        publicPath: '',
        chunkFilename: 'chunk/[chunkhash].chunk-bundle.js',
        jsonpFunction: 'wedevsPmWebpack',
        // hotUpdateFunction: 'wedevsPmWebpacks',
    },

    module: {
        rules: [
            // doc url https://vue-loader.vuejs.org/en/options.html#loaders
            {   
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        //js: 'babel-loader!eslint-loader'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/ 
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                exclude: /node_modules/,
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },

    plugins: [
        // new HTMLWebpackPlugin({
        //     title: 'Code Splitting'
        // }),
    ]
}
