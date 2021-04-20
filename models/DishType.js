const mongoose = require('mongoose')
const Schema = mongoose.Schema
const schema = new Schema({
  name: {
    type: String,
    required: true
  },

})
// schema.virtual('dishList', {
//   localField: '_id',
//   foreignField: 'Dish',
//   justOne: false,
//   ref: 'Dish'
// })

module.exports = mongoose.model('DishType', schema)
