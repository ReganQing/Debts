// 导入mongoose
const mongoose = require('mongoose');


// 创建文档的结构对象
// 设置集合中文档的属性以及属性值的类型
let AccountSchema = mongoose.Schema({
    // 标题
    title: {
        type: String,
        required: true
    },
    // 时间
    time: {
        type: Date,
        required: true
    },
    // 类型
    type: {
        type: Number,
        default: -1,
        required: true
    },
    // 金额
    account: {
        type: Number,
        min: 0,
        required: true

    },
    // 描述
    remarks: {
        type: String,  
    }
});

// 创建模型对象
let AccountModel = mongoose.model('accounts', AccountSchema);

// 暴露模型对象
module.exports = AccountModel;