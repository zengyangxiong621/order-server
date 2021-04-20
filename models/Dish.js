const mongoose = require('mongoose')
const Schema = mongoose.Schema
const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
  },
  desc: {
    type: String,
  },
  avatar: {
    type: String,
  },
  unit: {
    type: String
  },
  dishTypeId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'DishType'
  }
})
module.exports = mongoose.model('Dish', schema)
