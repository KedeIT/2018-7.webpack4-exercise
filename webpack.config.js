const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
/// 需要清除的文件夹
let pathsToClean = [
    'dist'
];

// 遇到一个问题，cleanOptions不起作用
let cleanOptions = {
    exclude: ['test.js'],
    dry: false,
    verbose: true 
};

const config =  {
    // 入口  entry后面可跟String，Array[String], {String: String|Array} 对象是最可拓展的方式
    entry: {
        index: './src/index.js',
        home: './src/home.js',
        cart: './src/cart.js',
        my: './src/my.js',
        testsass: './src/testsass.js'
    },
    // entry: ['./src/index.js', './src/home.js'],
    
    // 输出 打包输出绝对路径 文件名 
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    
    //模式
    mode: 'development',

    //插件 plugins
    plugins: [
        /// 创建一个引用output中js文件的html文件 默认是index.html, css文件则以link标签形式在<head />中引用
        new HtmlWebPackPlugin(),
        new HtmlWebPackPlugin({
            title: '我是通过plugin创建的',
            filename: 'webpack_index.html',
            template: './src/index.html',
            // -- 允许加载的模块
            chunks: ['my', 'home', 'index']
        }),
        new HtmlWebPackPlugin({
            title: '测试sass',
            filename: 'wbtestsass.html',
            template: './src/testsass.html',
            // -- 允许加载的模块
            chunks: ['testsass']
        }),
        // 清除无用打包文件
        new CleanWebpackPlugin(pathsToClean),

        /// -- 权利声明插件
        new webpack.BannerPlugin({
            banner: 'Clare: hash:[hash], chunkhash:[chunkhash], name:[name],filebase:[filebase],query:[query],file:[file]'
        }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),

        /// 删除冗余css
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'app/*html')),
        })
    ],

    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        host: 'localhost',
        port: 8090,
        open: true,
        inline: true,
        hot: true
    },

    // loader
    module: {
        rules: [
            {
            test: /\.css$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../'
                    }
                },
                // 'style-loader',
                'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img/'
                        }
                    },
                    {
                        loader: 'url-loader',
                        options: {
                            // limit: 8192000000
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                            removeComments: false,
                            collapseWhitespace: false
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {

                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    }
};

module.exports = config;

/*
 1. 使用html-loader后 图片有占位但是显示不出来
 2. mini-css-extract-loader 跟 style-loader冲突吗？并存的时候提示Module parse failed: unexpected character '#'
  loader在use数组中顺序是否会影响配置加载结果

*/ 