const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');   // HTML导出模块
const yargs = require('yargs');

let htmlList = [{ title: 'main', page: 'main' }]
let HTMLPlugins = []
let Entries = {}
htmlList.forEach(item => {
    const htmlPlugin = new HTMLWebpackPlugin({
        title: item.title, // 生成的html页面的标题
        filename: `${item.page}.html`, // 生成到dist目录下的html文
        template: path.resolve(__dirname, `./go.html`), // 模板文件，不同入口可以根据需要设置不同模板
        chunks: [item.page, 'vendor'], // html文件中需要要引入的js模块，这里的 vendor 是webpack默认配置下抽离的公共模块的名称
        minify: {
            collapseWhitespace: true,    // 压缩空白
            removeAttributeQuotes: true  // 删除属性双引号
        }
    });
    HTMLPlugins.push(htmlPlugin);
    // Entries.vendor = ['vue']
    Entries[item.page] = path.resolve(__dirname, `./main.js`); // 根据配置设置入口js文件
    console.log('Entries,', Entries)
});
module.exports = {
    // mode: 'production',//生产模式
    // devtool: 'source-map',//错误日志，不安全
    // optimization: {
    //     minimize: true,//mode为production则不需要设置
    // },
    entry: Entries,
    output: {
        filename: '[name]_[chunkhash].js',
        chunkFilename: '[name]_[chunkhash].min.js'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ],
                loader: "babel-loader",
                options: {
                    presets: ["es2015"]
                }
            },
            {
                test: /\.vue$/,
                use: ["vue-loader"],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },

            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    mode: 'development',
    devServer: {
        publicPath: '/dist',
        proxyTable: {
            '/api': {
                target: 'http://localhost:3000', //后端接口地址
                changeOrigin: true, //是否允许跨越
                pathRewrite: {
                    '^/api': '', //重写,
                }
            }
        }
    },
    stats: { children: false },
    plugins: [
        ...HTMLPlugins,
        new VueLoaderPlugin()
    ] // 多页面输出]
}
