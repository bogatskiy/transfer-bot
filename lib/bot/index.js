'use strict'

const telegramBot = require('node-telegram-bot-api')
const TOKEN = require('../../config').token
const bot = new telegramBot(TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 100
    }
  }
})

module.exports = bot