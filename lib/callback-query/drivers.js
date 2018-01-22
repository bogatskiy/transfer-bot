'use strict'

const bot = require('../bot')
const mongoose = require('mongoose')
const Trip = mongoose.model('trip')
const User = mongoose.model('user')
const {tripFrom, tripTo} = require('../helpers')

async function driveTripFrom(query) {
  const {id} = query.message.chat
  try {
    const user = await User.findOne({id})
    const from = query.data.slice(0, -7)
    const trip = await Trip.find({from: from, completed: false})

    await bot.deleteMessage(id, query.message.message_id)

    if (user.isDriver) {
      if (trip.length === 0 ||trip.length === 1 && trip[0].id == user.id) {
        await bot.sendMessage(id, `Попутчиков <b>${tripFrom(from)}</b> нет. 

<i>Чтобы проверить снова нажмите</i> /start`, {parse_mode: 'HTML'})
      }
      else {
        await Promise.all(trip.map(async i => {
          const user = await User.findOne({id: i.id})
          const userInfo = JSON.stringify({
            callback: 'pickUp',
            id: i.id,
            first_name: i.first_name
          })
          if (!user.isDriver) {
            await bot.sendMessage(id, `${user.first_name} едет 
<b>${tripFrom(i.from)} ${tripTo(i.to)}</b>`,
              {
                parse_mode: 'HTML',
                reply_markup: {
                  inline_keyboard: [
                    [{
                      text: 'Отправить мой контакт',
                      callback_data: userInfo
                    }],
                    [{
                      text: 'Игнорировать',
                      callback_data: 'ignore'
                    }]
                  ]
                }
              })
          }
        }))
        await bot.sendMessage(id, `Чтобы проверить снова нажмите /start`)
      }
    }
  } catch (e) {
    console.error(e)
  }
}

async function driverPickUp(query) {
  const {id} = query.message.chat
  await bot.deleteMessage(id, query.message.message_id)
  const callback = JSON.parse(query.data)
  const user = await User.findOne({id})
    await bot.sendMessage(callback.id,
      `🚕
Водитель <b>${user.first_name}</b> готов Вас подвезти, пожалуйста, свяжитесь с ним.`,
      {parse_mode: 'HTML'})
    await bot.sendContact(callback.id, user.phone_number, user.first_name)
}

async function ignorePassenger(query) {
  const {id} = query.message.chat
  await bot.deleteMessage(id, query.message.message_id)
}

module.exports = {
  driveTripFrom,
  driverPickUp,
  ignorePassenger
}