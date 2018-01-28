process.env['NTBA_FIX_319'] = 1

const bot = require('./lib/bot')
const mongoose = require('./lib/mongoose')
const {start, sendContact, changeRoleOnText, help} = require('./lib/ontext')
const {query, queryDriver, queryPassenger} = require('./lib/callback-query')
const Watcher = require('./watcher')
const tripLifetimeWatcher = require('./watcher/workers/tripLifetimeWatcher')

bot.on('message', sendContact)

bot.onText(/\/start/, start)
bot.onText(/\/changerole/, changeRoleOnText)
bot.onText(/\/help/, help)

bot.on('callback_query', query)
bot.on('callback_query', queryDriver)
bot.on('callback_query', queryPassenger)

bot.on('polling_error', e => console.log(e))

const watcher = new Watcher(
  [{
    name: tripLifetimeWatcher,
    bot,
    mongoose
  }], 1000)

watcher.start()

process.on('SIGTERM', () => {
  watcher.stop()
  mongoose.disconnect()
  process.exit(0)
})