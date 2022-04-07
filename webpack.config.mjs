// const require = module.createRequire();
// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let config = {
    mode: 'development',
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, './webssh'),
        // publicPath: "/assets/",
        filename: "[contenthash].js",
        // publicPath: "static/webssh/",
        clean: {
            keep(asset) {
                return asset.includes('ignored');
            }
        }
    },
    // devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.cast/,
                type: 'asset/resource'
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ],
    },
    // publicPath: "",
    devServer: {
        proxy: { // proxy URLs to backend development server
            '/api': 'http://localhost:3000'
        },
        contentBase: path.join(__dirname, './webssh'),
        https: true,
        compress: true,
        port: 9000,
        hot: true,
        sockHost: '192.168.86.60',
        sockPath: '/listener1-ws/webssh'
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                title: 'Web SSH',
                template: 'index.html',
                inject: 'body',
            }
        )
    ]
  };

export default (env, argv) => {
    let dev = argv.mode=== 'development';
    config.mode = argv.mode;
    
    if (dev) {
        config.devtool = 'source-map';
    } else {
        config.output.publicPath ='static/webssh/';
    }
    return config;
}