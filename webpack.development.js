const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');   // HTML导出模块

const fs = require('fs')

const dir = `${__dirname}/src/views`
const files = fs.readdirSync(dir)
console.log(dir, 'dirdirdirdir')

let htmlList = []
for (let file of files) {
    htmlList.push({ title: file.replace('.vue', ''), page: file.replace('.vue', '') })
}
let HTMLPlugins = []
let Entries = {}
htmlList.forEach(item => {
    const htmlPlugin = new HTMLWebpackPlugin({
        title: item.title, // 生成的html页面的标题
        filename: `${item.page}.html`, // 生成到dist目录下的html文
        template: path.resolve(__dirname, `./index.html`), // 模板文件，不同入口可以根据需要设置不同模板
        chunks: [item.page, 'vendor'], // html文件中需要要引入的js模块，这里的 vendor 是webpack默认配置下抽离的公共模块的名称
        minify: {
            collapseWhitespace: true,    // 压缩空白
            removeAttributeQuotes: true  // 删除属性双引号
        }
    });
    HTMLPlugins.push(htmlPlugin);
    process.env.pagename = item.page
    fs.readFile(path.join(__dirname, './src/main.js'), 'utf8', function (err, data) {
        let str = String(data)
        let _content = str.replace(/home/, item.title)

        console.log(item.title, '修改内容')
        console.log(_content, '文件内容')
        // console.log(path.join(__dirname, `./src/${item.title}.js`),'path.join(__dirname, `./${item.title}.js`')
        fs.writeFile(path.join(__dirname, `./dist/dev/${item.title}.js`), _content, 'utf8', function (err, data) {
            console.log(err, 'errerrerrerr')
        })

    })
    Entries[item.page] = path.resolve(__dirname, `./dist/dev/${item.title}.js`); // 根据配置设置入口js文件
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
    resolve: {
        // 在导入语句没带文件后缀时，webpack会自动按照顺序添加后缀名查找
        extensions: ['.js', '.vue', '.json'],
        // 配置别名
        alias: {
            '@': path.join(__dirname, '.src/', ),
        }
    },
    stats: { children: false },
    plugins: [
        ...HTMLPlugins,
        new VueLoaderPlugin()
    ] // 多页面输出]
}
