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
      if (trip.length === 0 || trip.length === 1 && trip[0].id == user.id) {
        await bot.sendMessage(id, `Попутчиков <b>${tripFrom(from)}</b> нет. 

<i>Чтобы проверить снова нажмите</i> /start`, {parse_mode: 'HTML'})
      }
      else {
        await Promise.all(trip.map(async i => {
          const user = await User.findOne({id: i.id})
          const userInfo = JSON.stringify({
            cb: 'Up',
            _id: i._id.toString()
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
  try {

    const {id} = query.message.chat
    await bot.deleteMessage(id, query.message.message_id)
    const callback = JSON.parse(query.data)
    const nowDate = new Date().getTime()

    const trip = await Trip.findOne({_id: callback._id})
    const user = await User.findOne({id})
    const passenger = await User.findOne({id: trip.id})
    const tripDate = new Date(trip.date).getTime()

    if (nowDate - tripDate <= 1800000 && trip.completed === false && passenger.isDriver === false) {
      await bot.sendMessage(trip.id,
        `🚕
Водитель <b>${user.first_name}</b> готов Вас подвезти, пожалуйста, свяжитесь с ним.`,
        {parse_mode: 'HTML'})
      await bot.sendContact(trip.id, user.phone_number, user.first_name)
      await bot.answerCallbackQuery(query.id, 'Контакт отправлен')
    } else {
      await bot.answerCallbackQuery(query.id, 'Заявка удалена')
    }
  } catch (e) {
    console.log(e)
  }
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