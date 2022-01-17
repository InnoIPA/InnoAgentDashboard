const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// Load config from .env file.
const Dotenv = require("dotenv-webpack");
const targetIP = "http://127.0.0.1:8162";

module.exports = {
    //devtool: 'cheap-module-eval-source-map',
    module: {

        rules: [{
            test: /\.html$/,
            use: [{
                loader: "html-loader",
                options: { minimize: true }
            }]
        },
        {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"]
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }, {
            //test: /\.(jpe?g|png|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
            test: /\.(gif|jpe|jpg|png|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 100000
                }
                // loader: 'file-loader',
                // options: {}
            }]
        }, {
            test: /\.(scss|sass)$/,
            use: [
                // 需要用到的 loader
                MiniCssExtractPlugin.loader,
                "css-loader",
                "sass-loader"
            ]
        }
        ]
    },
    plugins: [
        new webpack.BannerPlugin("Add innodisk license here"),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            inject: true,
            favicon: "./favicon.ico"
        }),
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        //引入热更新插件
        new webpack.HotModuleReplacementPlugin(),
        // dotenv
        // new Dotenv(),
        new webpack.DefinePlugin({
            DASHBOARD_VERSION: JSON.stringify(require("./package.json").version),
        }),
    ],
    node: {
        fs: "empty"
    },
    externals: {
        "./cptable": "var cptable",
        "../xlsx.js": "var _XLSX"
    },
    devServer: {
        host: "localhost", //服务器的ip地址
        compress: true,
        port: 9996, //端口
        open: true, //自动打开页面
        hot: true, //开启热更新
        proxy: {
            "/api": {
                target: targetIP,
                secure: false,
                changeOrigin: true
            },
        }
    }
};