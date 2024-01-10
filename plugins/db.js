module.exports = app => {
  const mongoose = require('mongoose')

  mongoose.connect('mongodb://mongo:27017/order-sys', {useNewUrlParser: true, useUnifiedTopology: true});
  mongoose.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
  });
  mongoose.connection.on("open", function () {
    console.log("------数据库连接成功！------");
  });
  // 把models 里的 js 全部引用一遍
  require('require-all')(__dirname + '/../models')
  const DishType = require('../models/DishType')
  // DishType.insertMany([{
  //   name :"葫芦娃",
  // },{
  //   name :"车子",
  // }],function (err, res) {
  //   if(err) throw err
  //   console.log("用户数据增加成功",res)
  // })
}
