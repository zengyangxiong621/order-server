const mongoose = require('mongoose')
const Schema = mongoose.Schema
const schema = new Schema({
  intro: String,
  status: {
    type: Boolean,
    default: false
  }
})
module.exports = mongoose.model('comment', schema)
