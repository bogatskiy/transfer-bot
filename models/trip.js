'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TripSchema = new Schema({
  id: {type: Number, requred: true},
  phone_number: {type: String, requred: true},
  first_name: {type: String, requred: false},
  from: {type: String},
  to: {type: String},
  date: {type: Date},
  completed: {type: Boolean, default: false, requred: true}
})

mongoose.model('trip', TripSchema)