'use strict'

const bot = require('../bot')
const mongoose = require('mongoose')
const Trip = mongoose.model('trip')
const User = mongoose.model('user')
const {kbTo, tripFrom, tripTo, regTripPassText} = require('../helpers')

async function pasTripFrom(query) {

  const {id} = query.message.chat
  const {from} = JSON.parse(query.data)

  try {
    await bot.deleteMessage(id, query.message.message_id)
    const user = await User.findOne({id})
    const trip = await Trip.findOne({id, completed: false})
    const newTrip = new Trip({
      id: id,
      first_name: user.first_name,
      from: from
    })

    if (!user.isDriver && trip === null) {
      try {
        await newTrip.save()
        await bot.sendMessage(id, '🙋🏻‍♂️ Куда Вы направляетесь?', {reply_markup: {inline_keyboard: kbTo('tripTo', from)}})
      } catch (e) {
        console.log(e)
      }
    }
  }
  catch (e) {
    console.log(e)
  }
}

async function pasTripTo(query) {
  const {id} = query.message.chat

  try {
    await bot.deleteMessage(id, query.message.message_id)
    const user = await User.findOne({id})
    const trip = await Trip.findOne({id, completed: false})
    const date = new Date(query.message.date * 1000)
    const {to} = JSON.parse(query.data)

    if (!user.isDriver && trip && trip.to === undefined) {
      const _id = trip._id.toString()
      const userInfo = JSON.stringify({cb: 'Up', _id})

      trip.to = to
      trip.date = date
      await trip.save()

      await bot.sendMessage(id, regTripPassText(trip.from, to, trip.date, `Для оформления новой заявки или удаления существующей, нажмите /start`), {parse_mode: 'HTML'})

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
        }
        catch (e) {
          console.error(e)
        }
      }))
    }

  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  pasTripFrom,
  pasTripTo
}