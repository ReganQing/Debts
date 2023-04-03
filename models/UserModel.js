// 导入mongoose
const mongoose = require('mongoose');


// 创建文档的结构对象
// 设置集合中文档的属性以及属性值的类型
let UserSchema = mongoose.Schema({
    // 用户名
    username: {
        type: String,
        required: true
    },
    // 密码
    password: {
        type: String,
        required: true
    }
});

// 创建模型对象
let UserModel = mongoose.model('users', UserSchema);

// 暴露模型对象
module.exports = UserModel;