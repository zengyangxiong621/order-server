module.exports = app => {
  const express = require('express')
// jwt 是对 token 进行加密
  const jwt = require('jsonwebtoken')
// 管理员 model
  const Manager = require('../models/Manager')
  const User = require('../models/User')
// 状态码处理插件
  const assert = require('http-assert')

  const router = express.Router({
    mergeParams: true
  })


  const resourceMiddleWare = require('../middleware/resource')
  router.post('/', async (req, res) => {
    // const Model = require(`../../models/${req.params.resource}`)
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  // 登录
  router.post('/login', async (req, res) => {
    // req.body = (this.model)
    const {username, password} = req.body

    const user = await User.findOne({
      username: username
    }).select('+password')
    if (!user) {
      return res.status(422).send({
        message: '用户不存在'
      })
    }
    if (user.password != password) {
      return res.status(421).send({
        message: '密码错误'
      })
    }
    const token = jwt.sign({
      id: user._id
    }, 'bear')
    console.log(user)
    res.send({token, user})
  })
  router.post('/mananger/login', async (req, res) => {
    // req.body = (this.model)
    const {username, password} = req.body

    const user = await Manager.findOne({
      username: username
    }).select('+password')
    if (!user) {
      return res.status(422).send({
        message: '用户不存在'
      })
    }
    if (user.password != password) {
      return res.status(421).send({
        message: '密码错误'
      })
    }
    const token = jwt.sign({
      id: user._id
    }, 'bear')
    console.log(user)
    res.status(200).send({token, user, message: '登录成功'})
    res.send()
  })
  // 获取列表
  router.get('/mananger/list', async (req, res) => {
    // req.body = (this.model)
    const users = await Manager.find()
    res.send(users)
  })
  // 删除
  router.delete('/manager/delete/:id', async (req, res) => {
    // console.log(req.params.id)
    // console.log(req.body)
    await Manager.findByIdAndDelete(req.params.id)
    res.send({
      success: true
    })
  })
  // 修改
  router.put('/manager/update/:id', async (req, res) => {
    // console.log(req.params.id)
    // console.log(req.body)
    const manager = await Manager.findOne({username: req.body.username})
    const selfManager = await Manager.findById(req.params.id)
    if (selfManager.username === req.body.username) {
      return res.send({
        message: '修改成功'
      })
    }
    if (manager) {
        return res.status(423).send({
        message: '用户名已经存在'
      })
    }
    const model = await Manager.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  // 注册管理员
  router.post('/manager/register', async (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
      return res.status(424).send({
        message: '请输入账号密码'
      })
    }
    const user = await Manager.findOne({
      username: username
    }).select('+password')
    if (user) {
      return res.status(423).send({
        message: '用户已经存在'
      })
    }
    const newManager = await Manager.create({
      username,
      password
    })
    res.send(newManager)
  })
  // 注册管理员
  router.post('/user/register', async (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
      return res.status(424).send({
        message: '请输入账号密码'
      })
    }
    const user = await User.findOne({
      username: username
    }).select('+password')
    if (user) {
      return res.status(423).send({
        message: '用户已经存在'
      })
    }
    const newManager = await User.create({
      username,
      password
    })
    res.send(newManager)
  })
  // 查看用户
  router.get('/user', async (req, res) => {
    const userList = await User.find()
    res.send(userList)
  })
  app.use('/admin', router)
}
