// 导入express
const express = require('express');
// 导入moment
const moment = require('moment');
// 导入中间件检测登录
const checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware');
// 导入AccountModel
const AccountModel = require('../../models/AccountModel');



// *************** 路由接口 ***************


// 创建路由
const router = express.Router();


// 首页
router.get('/', (req,res) => {
  res.redirect('/account');
});

// 获取记账本的列表
router.get('/account', checkLoginMiddleware, function (req, res, next) {
  // 获取所有的账单信息
  // let accounts = db.get('accounts').value();
  AccountModel.find().sort({ time: -1 }).then((data, err) => {
    if (err) {
      res.status(500).send('读取失败!');
      return;
    }
    // 响应成功的提示
    res.render('list', { accounts: data, moment: moment });
  });
});


// 添加记录
router.get('/account/create', checkLoginMiddleware,  function (req, res, next) {
  res.render('create')
});

// 新增记录
router.post('/account', checkLoginMiddleware,  (req, res) => {
  // 查看表单数据 要解决的问题： 2023-04-05 => new Date()
  // 插入数据库
  AccountModel.create({
    ...req.body,
    // 修改time属性的值
    time: moment(req.body.time).toDate().toLocaleDateString(),
  }).then((data, err) => {
    if (err) {
      res.status(500).send('添加失败!');
      return;
    }
    // 成功提醒
    res.render('success', { msg: '已经添加成功了哦~~', url: '/account' });
  });
});


// 删除记录
router.get('/account/delete/:id', checkLoginMiddleware, (req, res) => {
  // 获取params的id
  let id = req.params.id;
  // 删除数据

  AccountModel.deleteOne({ _id: id}).then((data, err) => {
    if (err) {
      res.status(500).send('删除失败!');
      return;
    }
    // 成功提醒
    res.render('success', { msg: '已经删除成功了哦~~', url: '/account' });
  });

});

module.exports = router;
