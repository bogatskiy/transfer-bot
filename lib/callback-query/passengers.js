'use strict'

const bot = require('../bot')
const mongoose = require('mongoose')
const Trip = mongoose.model('trip')
const User = mongoose.model('user')
const {keyboardTo, tripFrom, tripTo, regTripPassText, debug} = require('../helpers')

async function pasTripFrom(query) {
  try {
    const {id, first_name} = query.message.chat
    const user = await User.findOne({id})
    const trip = await Trip.findOne({id, completed: false})
    const newTrip = new Trip({
      id: id,
      first_name: first_name,
      from: query.data
    })

    if (!user.isDriver) {
      await bot.deleteMessage(id, query.message.message_id)
      if (trip === null) {
        await newTrip.save()
        await bot.sendMessage(id, 'Куда Вы направляетесь?', {reply_markup: {inline_keyboard: keyboardTo(query.data)}})
      }
      else {
        await bot.deleteMessage(id, query.message.message_id)
      }
    }
    else {
      await bot.deleteMessage(id, query.message.message_id)
    }
  } catch (e) {
    console.log(e)
  }
}

async function pasTripTo(query) {
  const {id, first_name} = query.message.chat

  try {
    const user = await User.findOne({id})
    const trip = await Trip.findOne({id, completed: false})
    const _id = trip._id.toString()

    const date = new Date(query.message.date * 1000)
    const to = query.data.toLowerCase().slice(2)
    const userInfo = JSON.stringify({
      cb: 'Up',
      _id
    })
    await bot.deleteMessage(id, query.message.message_id)

    if (!user.isDriver) {
      if (trip.to === undefined) {
        trip.to = to
        trip.date = date
        await trip.save()

        await bot.sendMessage(id, regTripPassText(tripFrom(trip.from), tripTo(trip.to), trip.date, 'Для оформления новой заявки или удаления существующей, нажмите /start'), {parse_mode: 'HTML'})

        let drivers = await User.find({isDriver: true})
        await Promise.all(drivers.map(async driver => {
          try {
            await bot.sendMessage(driver.id, `${user.first_name}, едет ${tripFrom(trip.from)} ${tripTo(to)}. Подвезете его?`, {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: `Да`,
                      callback_data: userInfo
                    },
                    {
                      text: `Нет`,
                      callback_data: `ignore`
                    }
                  ]
                ]
              }
            })
          } catch (e) {
            console.error(e)
          }
        }))
      } else {
        await bot.deleteMessage(id, query.message.message_id)
      }
    } else {
      await bot.deleteMessage(id, query.message.message_id)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  pasTripFrom,
  pasTripTo
}