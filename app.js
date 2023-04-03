const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 导入 express-session connect-mongo
const session = require('express-session');
const MongoStore = require('connect-mongo');

// 导入配置项
const {DBHOST,DBPORT,DBNAME} = require('./config/config');


// 导入 account 接口路由文件
const accountRouter = require('./routes/api/account');
const indexRouter = require('./routes/web/index');
const authRouter = require('./routes/web/auth');
const authApiRouter = require('./routes/api/auth');

// 创建应用
const app = express();

// 设置 session的中间件
app.use(session({
  name: 'sid',    // 设置cookie的name， 默认值是: connect.sid
  secret: 'ron',   // 参与加密的字符串（又称签名）， 加盐
  saveUninitialized: false, // 是否为每次请求都设置一个cookie用来存储session的id
  resave: true, // 是否在每次请求时都重新保存session 
  store: MongoStore.create({
      mongoUrl: `mongodb://${DBHOST}:${DBPORT}/${DBNAME}`, // 连接mongodb数据库
  }),
  cookie: {
      httpOnly: true, // 只在浏览器中可见,开启后前端无法通过 JS 操作
      maxAge: 1000 * 60 * 60 * 24 * 7, // sessionID 过期时间，单位是毫秒,此处 为7天
  }
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/api', accountRouter);
app.use('/api', authApiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // 响应404模板
  res.render('404');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
