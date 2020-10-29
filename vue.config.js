let path = require('path');
const { config } = require('process');

// 合并绝对路径
function resolve(dir) {
    return path.join(__dirname,dir);
}

module.exports = {
    chainWebpack: (config)=> {
        config.resolve.alias
            .set('@',resolve('src'))
            .set('assets',resolve('./src/assets'))
    }
}