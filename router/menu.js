module.exports = app => {
  const express = require('express')
  const router = express.Router()
  const DishType = require('../models/DishType')
  const Dish = require('../models/Dish')
  const Order = require('../models/Order')
  const Comment = require('../models/Comment')
  const User = require('../models/User')
  const createError = require("http-errors");
  const assert = require('http-assert')
  const multiparty = require('multiparty');
  const util = require('util');
  const fs = require('fs')
  const path = require('path')
  const multer = require('multer')
  const dayjs = require('dayjs')
// middleware that is specific to this router

// define the home page route
  // 获取菜品类型列表
  router.get('/dish_type/list', async function (req, res) {
    const dishTypeList = await DishType.find()
    res.send(dishTypeList)
  })
  // 修改菜品类型
  router.put('/dish_type/:id', async function (req, res) {
    const dishType = await DishType.findByIdAndUpdate(req.params, req.body)
    res.send(dishType)
  })
  // 新增菜品类型
  router.post('/dish_type/add', async function (req, res) {
    const {name} = req.body
    const dishType = await DishType.findOne({
      name: name
    })
    if (dishType) {
      return res.status(423).json({
        message: '该菜品类型已经存在'
      })
    }
    const newDishType = await DishType.create({
      name
    })
    // console.log(name)
    res.send(newDishType)
  })
  // 删除菜品类型
  router.delete('/dish_type/delete/:id', async function (req, res) {
    await DishType.findByIdAndDelete(req.params.id)
    res.send({
      success: true
    })
  })
  // 修改菜品类型
  router.put('/dish_type/update/:id', async function (req, res) {

    const dishType = await DishType.findOne({
      name: req.body.name
    })
    if (dishType) {
      return res.status(423).send({
        message: '该菜品类型已经存在'
      })
    }
    const newDishType = await DishType.findByIdAndUpdate(req.params.id, req.body)
    res.send(newDishType)
  })
  // 新增菜品
  router.post('/dish/add', async function (req, res) {
    // console.log(req.body)
    const model = Dish.create(req.body)
    res.send(model)
  })
  router.post('/menu_List', async function (req, res) {
    const dishList = await DishType.aggregate(
      [
        {
          $lookup:
            {
              from: "dishes",
              localField: "_id",
              foreignField: "dishTypeId",
              as: "dishList"
            }
        }
      ]
    )
    res.send(dishList)
  })
  // 查询菜品列表
  router.post('/dish/list', async function (req, res) {
    const {_id, ...model} = req.body
    // console.log('_id:', _id)
    // console.log('model:', model)
    const oneDish = await Dish.findById(_id)
    // console.log(oneDish)
    let dishList = {}
    if (_id) {
      dishList = await Dish.aggregate(
        [
          {$match: {_id: oneDish._id}},// 过滤数据
          {
            $lookup:
              {
                from: "dishtypes",
                localField: "dishTypeId",
                foreignField: "_id",
                as: "dishType"
              }
          }
        ]
      )
    } else {
      dishList = await Dish.aggregate(
        [
          {
            $lookup:
              {
                from: "dishtypes",
                localField: "dishTypeId",
                foreignField: "_id",
                as: "dishType"
              }
          }
        ]
      )

    }
    // console.log(dishList)
    dishList = dishList.map(item => {
      return {
        ...item,
        'dishTypeId': item.dishType[0]._id,
        'dishType': item.dishType[0].name,
      }
    })
    res.send(dishList)
  })
  // 删除菜品
  router.delete('/dish/delete/:id', async function (req, res) {
    // console.log(req.params)
    await Dish.findByIdAndDelete(req.params.id)
    res.send({
      success: true
    })
  })
  router.put('/dish/update/:id', async function (req, res) {
    const id = req.params.id
    const newDish = await Dish.findByIdAndUpdate(id, req.body)
    res.send(newDish)
  })
  // 上传图片
  const upload = multer({
    dest: path.join(path.resolve('./'), 'uploads')
  })
  router.post('/upload', upload.single('file'), async function (req, res) {
    // console.log(path.join(path.resolve('./'), 'uploads'))
    // console.log(req)
    const file = req.file
    // 把图片上传到服务器
    file.url = `http://localhost:3000/uploads/${file.filename}`
    // console.log(file)
    res.send(file)
  })
  // 创建订单
  router.post('/order', async function (req, res) {
    // console.log(req.body)
    let menuList = req.body
    const comment = await Comment.create({
      desc: '1'
    })
    const commentId = comment._id
    // console.log(menuList)
    menuList = menuList.map(item => {
      return {
        ...item,
        commentId,
        dishId: item._id,
        createTime: new Date()
      }
    })
    menuList = menuList.map(item => {
      let {_id, name, dishTypeId, desc, price, unit, avatar, ...dish} = item
      return dish
    })
    // console.log(menuList)
    const OrderList = Order.insertMany(menuList)
    // console.log(OrderList)
    res.send(commentId)
  })
  router.get('/order/:id', async function (req, res) {
    // console.log(req.params)
    const commentId = req.params.id
    const comment = await Comment.findById(req.params.id)
    const commentList = await Order.find({
      commentId
    })
    let arr = []
    for (let i = 0; i < commentList.length; i++) {
      const item = await Dish.findById(commentList[i].dishId)
      arr.push(item)
    }
    for (let i = 0; i < arr.length; i++) {
      arr[i] = {nums: commentList[i].nums, ...arr[i]._doc}
    }
    res.send({intro: comment.intro, status: comment.status, orderList: arr})
  })
  router.put('/order/submit/:id', async function (req, res) {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body)
    res.send({status: true})
  })
  router.post('/comment_list', async function (req, res) {
    const list = await Comment.find(req.body)
    res.send(list)
  })
  router.get('/order_list', async function (req, res) {
    const orderList = []
    const commentList = await Comment.find()
    for (let i = 0; i < commentList.length; i++) {
      const order = await Order.findOne({
        commentId: commentList[i]._id
      })
      const createTime = order.createTime
      const user = await User.findOne({
        _id: order.userId
      })
      orderList.push({
        status: commentList[i].status,
        _id: commentList[i]._id,
        createTime: dayjs(createTime).format('YYYY-MM-DD HH:mm:ss'),
        name: user.username,
        intro: commentList[i].intro
      })
    }
    res.send(orderList)
  })
  router.get('/dish_list', async (req, res) => {
    const dishList = await Dish.find()
    res.send(dishList)
  })
// define the about route
  router.get('/about', function (req, res) {
    res.send('About birds')
  })
  app.use('/menu/', router)

}
