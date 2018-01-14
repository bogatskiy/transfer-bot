'use strict'

const bot = require('../bot')
const {wait} = require('./index')


module.exports.query = async query => {
  const {id} = query.message.chat

  switch (query.data) {
    case 'wait':
      try {
        wait(query)
      } catch (e) {
        console.log(e)
      }
      break
  }
}