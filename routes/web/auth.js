var express = require('express');
const md5 = require('md5');
const UserModel = require('../../models/UserModel');
var router = express.Router();



router.get('/reg', (req, res) => {
    // 响应 html 模板内容
    res.render('auth/reg');
})

// 注册
router.post('/reg', (req, res) => {
    // 进行表单验证
    // 获取请求体的数据
    // 把密码进行MD5加密，登录进行密码验证时可以用密文比较验证
    UserModel.create({ ...req.body, password: md5(req.body.password) }).then((data, err) => {
        if (err) {
            res.status(500).send('注册失败，请稍后再试~');
            return;
        }
        res.render('success', { msg: '注册成功', url: '/login' });
    });
});

// 登录页面
router.get('/login', (req, res) => {
    // 响应 html 模板内容
    res.render('auth/login');
});

// 登录操作 
router.post('/login', (req, res) => {
    // 查询数据库
    let { username, password } = req.body;
    UserModel.findOne({ username: username, password: md5(password) }).then((data, err) => {
        if (err) {
            res.status(500).send('登录失败，用户名或密码错误~');
            return;
        }
        // 用户有可能还未注册，需要对返回的data做个判断
        if (!data) {
            return res.send('用户名或密码错误');
        }

        // 保存用户信息到session中
        req.session.username = data.username;
        req.session._id = data._id;
        // 登录成功响应
        res.render('success', { msg: '登录成功', url: '/account' });
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
