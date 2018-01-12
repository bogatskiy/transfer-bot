process.env['NTBA_FIX_319'] = 1

const bot = require('./lib/bot')
const mongoose = require('./lib/mongoose')

const {driver, passenger, pasTripFrom, pasTripTo, driveTripFrom, stopTrip, continueTrip, wait} = require('./lib/callback-query')

const {start, sendContact, changeRoleOnText, help} = require('./lib/ontext')


bot.on('message', sendContact)
bot.onText(/\/start/, start)
bot.onText(/\/changerole/, changeRoleOnText)
bot.onText(/\/help/, help)


bot.on('callback_query', query => {
  const {id} = query.message.chat
  switch (query.data) {
    // Смена роли
    case 'driver':
      driver(query)
      break
    case 'passenger':
      passenger(query)
      break
    // Пассажиры пункт отправления
    case 'kp':
      pasTripFrom(query)
      break
    case 'adler':
      pasTripFrom(query)
      break
    case 'sochi':
      pasTripFrom(query)
      break
    // Пассажиры пункт назначения
    case 'toKp':
      pasTripTo(query)
      break
    case 'toAdler':
      pasTripTo(query)
      break
    case 'toSochi':
      pasTripTo(query)
      break
    // Отмена поездки пассажиром
    case 'stopTrip':
      stopTrip(query)
      break
    case 'continueTrip':
      continueTrip(query)
      break
    case  'kp_driver':
      driveTripFrom(query)
      break
    case  'adler_driver':
      driveTripFrom(query)
      break
    case  'sochi_driver':
      driveTripFrom(query)
      break
    case 'wait':
      wait(query)
      break
  }
})

bot.on('polling_error', error => console.log(error))
