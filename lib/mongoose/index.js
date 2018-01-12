'use strict'

const config = require('../../config')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(`mongodb://${config.db.user}:${config.db.pass}@${config.db.host}/${config.db.name}`, {useMongoClient: true})
  .catch(e => {
    console.error(e)
    throw e
  })

require('../../models/user')
require('../../models/trip')

const User = mongoose.model('user')
const Trip = mongoose.model('trip')

module.exports = mongoose