const path = require('path')
const webpack = require('webpack')
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MinifyPlugin = require("babel-minify-webpack-plugin")
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')
const devMode = process.env.NODE_ENV !== 'production'

const config = {
    entry: {
        app: path.join(__dirname, '../frontend/assets/js/app.js')
    },
    mode: devMode === 'production' ? 'production' : 'development',
    output: {
        filename: 'js/[name].js',
        path: path.join(__dirname, '../dist'),
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'components': path.resolve(__dirname, '../system/components'),
        }
    },
    module: {
       rules: [
            {
                test: /\.html$/,
                use: [
                    'html-loader'
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: [
                  {
                    loader: ExtractCssChunks.loader
                  },
                  "css-loader"
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    devMode ? 'style-loader' : ExtractCssChunks.loader,
                    'css-loader?url=false',
                    { 
                        loader:'postcss-loader',
                        options: {
                            config: {
                                path: path.resolve(__dirname, './postcss.config.js')
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            data: `
                                @import "./frontend/assets/sass/settings";
                                @import "./node_modules/foundation-sites/scss/foundation";
                                @import "./frontend/assets/sass/vendors/foundation";
                            `
                        }
                    }
                ],
            },
            {
                test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    useRelativePath: false,
                    emitFile: false //Prevents files from moving since they're correctly referenced
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            },
            {
                test: /\.svg$/,
                loader: 'vue-svg-loader',
                options: {
                    useSvgo: false, // (optional) default: true
                }
            },
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'frontend/assets/images/', to: 'images/' },
            { from: 'frontend/assets/fonts/', to: 'fonts/' },
        ], { copyUnmodified: true }),
        new VueLoaderPlugin(),
        new ExtractCssChunks({
              filename: "css/[name].css",
              chunkFilename: "[id].css",
              publicPath: path.join(__dirname, '../dist'),
        }),
        new WebpackBuildNotifierPlugin({
            sound: 'Funk',
            successSound: 'Pop'
        }),
        new webpack.ProvidePlugin({
            _ : ['lodash']
        }),
        new WriteFileWebpackPlugin()
    ],
}

if ( process.env.NODE_ENV === 'production' ) {
    config.plugins.push(
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new MinifyPlugin(),
        new OptimizeCssAssetsPlugin(),
        new ProgressBarPlugin()
    )
}


module.exports = config