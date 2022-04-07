const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let config = {
    mode: 'development',
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, './webssh'),
        // publicPath: "/assets/",
        filename: "[contenthash].js",
        // 打包到线上需要使用static/webssh开头。本地开发则不用，导出的时候做了处理
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

module.exports =  (env, argv) => {
    let dev = argv.mode=== 'development';
    config.mode = argv.mode;
    
    if (dev) {
        config.devtool = 'source-map';
    } else {
        config.output.publicPath ='static/webssh/';
    }
    return config;
}