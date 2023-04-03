// 导入express
const express = require('express');
// 导入moment
const moment = require('moment');
// 导入jsonwebtoken
const jwt = require('jsonwebtoken');
// 导入中间件检验token
const checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware');
const AccountModel = require('../../models/AccountModel');
const router = express.Router();

// ------------------ 路由接口 ------------------

// 记账本的列表
router.get('/account', checkTokenMiddleware, function (req, res, next) {
    // 获取所有的账单信息
    AccountModel.find().sort({ time: -1 }).then((data, err) => {
        if (err) {
            res.json({
                code: '1004',
                msg: '获取账单信息失败',
                data: null
            })
            return;
        }
        res.json({
            code: '0000',
            msg: '获取成功',
            data: data
        })
    });
});



// 新增记录
router.post('/account', checkTokenMiddleware, (req, res) => {
    // 查看表单数据 要解决的问题： 2023-04-05 => new Date()
    // 插入数据库
    AccountModel.create({
        ...req.body,
        // 修改time属性的值
        time: moment(req.body.time).toDate().toLocaleDateString(),
    }).then((data, err) => {
        if (err) {
            res.json({
                code: '1002',
                msg: '创建失败',
                data: null
            });
            return;
        }
        // 成功提醒
        res.json({
            code: '0000',
            msg: '创建成功',
            data: data
        })
    });
});

// 获取单条账单信息
router.get('/account/:id', checkTokenMiddleware, (req, res) => {
    // 获取params的id
    let { id } = req.params;

    // 查询对应ID的数据
    AccountModel.findById(id).then((data, err) => {
        if (err) {
            res.json({
                code: '1005',
                msg: '获取失败',
                data: null
            });
            return;
        };
        // 成功提醒
        res.json({
            code: '0000',
            msg: '获取成功',
            data: data
        });
    });

});

// 修改某条账单信息
router.patch('/account/:id', checkTokenMiddleware, (req, res) => {
    // 获取params的id
    let { id } = req.params;

    // 查询对应ID的数据
    AccountModel.updateOne({ _id: id }, req.body).then((data, err) => {
        if (err) {
            res.json({
                code: '1006',
                msg: '修改失败',
                data: null
            });
            return;
        };
        // 再次查询数据
        AccountModel.findById(id).then((data, err) => {
            if (err) {
                res.json({
                    code: '1005',
                    msg: '获取失败',
                    data: null
                });
                return;
            };
            // 成功提醒
            res.json({
                code: '00000',
                msg: '修改成功',
                data: data
            })

        });
    });

});

// 删除记录
router.delete('/account/delete/:id', checkTokenMiddleware, (req, res) => {
    // 获取params的id
    let id = req.params.id;
    // 删除数据

    AccountModel.deleteOne({ _id: id }).then((data, err) => {
        if (err) {
            res.json({
                code: '1003',
                msg: '删除失败',
                data: null
            })
            return;
        }
        // 成功提醒
        res.json({
            code: '0000',
            msg: '删除成功',
            data: {}
        })

    });

});
module.exports = router;
