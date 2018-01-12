'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  id: {type: String, requred: true},
  phone_number: {type: String, requred: true},
  first_name: {type: String, requred: false},
  last_name: {type: String, requred: false},
  isDriver: {type: Boolean, requred: false}
})

mongoose.model('user', UserSchema)