const express = require('express');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const {secret} = require('../../config/config');
const UserModel = require('../../models/UserModel');
const router = express.Router();



// 登录操作 
router.post('/login', (req, res) => {
    // 查询数据库
    let { username, password } = req.body;
    UserModel.findOne({ username: username, password: md5(password) }).then((data, err) => {
        if (err) {
            res.json({
                code: '2001',
                msg: '登录失败',
                data: null
            })
            return;
        }
        // 用户有可能还未注册，需要对返回的data做个判断
        if (!data) {
            return res.json({
                code: '2002',
                msg: '用户名密码错误',
                data: null
            })
        }

        // 创建token
        let token = jwt.sign({
            username: data.username,
            _id: data._id
        },secret, {
            expiresIn: 60 * 60 * 24 * 7
        });

        // 响应token
        res.json({
            code: '0000',
            msg: '登录成功',
            data: token
        })

    });
});

// 退出登录
router.post('/logout', (req, res) => {
    // 清除session
    req.session.destroy(() => {
        // 退出登录响应
        res.render('success', { msg: '退出成功', url: '/login' });
    })

});

module.exports = router;
