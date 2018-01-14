process.env['NTBA_FIX_319'] = 1

const bot = require('./lib/bot')
const mongoose = require('./lib/mongoose')
const { start, sendContact, changeRoleOnText, help } = require('./lib/ontext')
const { query } = require('./lib/callback-query')

bot.on('message', sendContact)

bot.onText(/\/start/, start)
bot.onText(/\/changerole/, changeRoleOnText)
bot.onText(/\/help/, help)

bot.on('callback_query', query)

bot.on('polling_error', e => console.log(e))
