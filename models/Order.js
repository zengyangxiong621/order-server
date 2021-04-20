const mongoose = require('mongoose')
const Schema = mongoose.Schema
const schema = new Schema({
  dishId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Dish'
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  nums: Number,
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  commentId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Comment'
  }
})
module.exports = mongoose.model('Order', schema)
