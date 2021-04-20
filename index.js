const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const path = require('path')
const router = express.Router()
const menu = require('./router/menu')
const admin = require('./router/admin')
const db = require('./plugins/db')
const bodyParser = require('body-parser');
// var allowCrossDomain = function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');//必须重新设置，把origin的域加上去
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Credentials', 'true');//和客户端对应，必须设置以后，才能接收cookie.
//   next();
// };

// app.use(allowCrossDomain);//运用跨域的中间件
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 路由
db(app)

menu(app)
admin(app)
/*
您提供给快速静态函数相对于从中启动节点进程的目录。
如果从另一个目录运行express应用程序，则更安全的做法是使用要服务的目录的绝对路径
 */
app.get('/', ((req, res) => {
  res.send('22')
}))
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


