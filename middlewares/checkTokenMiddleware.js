const jwt = require('jsonwebtoken');
const {secret} = require('../config/config');

// 声明中间件
module.exports = (req, res, next) => {
    // 获取token
    let token = req.get('token');
    // 判断token是否存在
    if (!token) {
        return res.json({
            code: '2003',
            msg: 'token不存在',
            data: null
        })
    };
    // 校验token
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            res.json({
                code: '2004',
                msg: 'token 校验失败',
                data: null
            });
            return;
        }
        // 保存用户的信息
        req.user = data;
        // 校验成功
        next();
    });
}