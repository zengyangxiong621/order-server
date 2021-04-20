const assert = require('http-assert')
const jwt = require('jsonwebtoken')

module.exports = (options) => {
  return async (req, res, next) => {
    const modelName = require('inflection').classify(req.params.resource)
    // inflection.classify( 'message_bus_properties' ); // === 'MessageBusProperty'
    // inflection 将一个 单词的 复数 写成 单数

    //  在 req 上挂载一个属性 Model
    req.Model = require(`../models/${modelName}`)
    next()
    // console.log(req.params)
    // console.log(modelName)
  }
}
