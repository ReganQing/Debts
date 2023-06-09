// 导入mongoose
const mongoose = require('mongoose');
// 创建文档的结构对象
// 设置集合中文档的属性以及属性值的类型
let MovieSchema = new mongoose.Schema({
    name: String,
    director: String,
    score: Number,
});

// 创建模型对象  对文档操作的封装对象
let MovieModel = mongoose.model('Movies', MovieSchema); // 第一个参数是集合名称，第二个参数是结构对象

// 暴露模型对象
module.exports = MovieModel;