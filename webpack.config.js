const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const shell = require('shelljs');
const outputPath = path.resolve( __dirname, 'views/assets/js')
const plugins = [];
const isProduction = (process.env.NODE_ENV == 'production');

//Remove all webpack build file
shell.rm('-rf', outputPath)

function resolve (dir) {
  return path.join(__dirname, './views/assets/src', dir)
}

if (isProduction) {
    plugins.push(
        new UglifyJsPlugin()
    )   
}

module.exports = {
    entry: {
        pm: './views/assets/src/start.js',
        library: './views/assets/src/helpers/library.js',
    },

    output: {
        path: outputPath,
        filename: '[name].js',
        publicPath: '',
        //chunkFilename: 'chunk/[chunkhash].chunk-bundle.js',
        //jsonpFunction: 'wedevsPmWebpack',
        // hotUpdateFunction: 'wedevsPmWebpacks',
    },

    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
          '@components': resolve('components'),
          '@directives': resolve('directives'),
          '@helpers': resolve('helpers'),
          '@router': resolve('router'),
          '@store': resolve('store'),
          '@src': resolve('')
        }
    },

    module: {
        rules: [
            // doc url https://vue-loader.vuejs.org/en/options.html#loaders
            {   
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: 'babel-loader',
                    }
                },
            },
            {   
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    resolve(''),
                    path.resolve('node_modules/vue-color'),
                    path.resolve('node_modules/vue-multiselect')
                ],
                query: {
                    presets:[ "env", "stage-3" , "es2015" ]
                }
             
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                exclude: /node_modules/,
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            }
        ]
    },
    plugins: plugins
}



