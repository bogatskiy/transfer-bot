'use strict'

const bot = require('../bot')
const mongoose = require('mongoose')
const Trip = mongoose.model('trip')
const User = mongoose.model('user')
const {keyboardTo, tripFrom, tripTo, regTripPassText} = require('../helpers')

async function pasTripFrom(query) {
  try {

    const {id, first_name} = query.message.chat
    const user = User.find({id})

    const trip = await Trip.findOne({id})
    const newTrip = new Trip({
      id: id,
      first_name: first_name,
      from: query.data
    })

    await bot.deleteMessage(id, query.message.message_id)

    if (!user.isDriver) {
      if (trip === null) {
        await newTrip.save()
        await bot.sendMessage(id, 'Куда Вы направляетесь?', {reply_markup: {inline_keyboard: keyboardTo(query.data)}})
      }
      else {
        await bot.sendMessage(id, `Передумали выезжать ${tripFrom(trip.from)} или продолжим оформлять заявку?`, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Продолжим',
                  callback_data: 'continueTrip'
                },
                {
                  text: 'Передумал',
                  callback_data: 'stopTrip'
                }
              ]
            ]
          }
        })
      }


    }

  } catch (e) {
    console.log(e)
  }
}

async function pasTripTo(query) {
  const {id, first_name} = query.message.chat

  try {
    const user = User.find({id})
    const trip = await Trip.findOne({id, completed: false})
    const date = new Date(query.message.date * 1000)
    const to = query.data.toLowerCase().slice(2)

    await bot.deleteMessage(id, query.message.message_id)


    if (!user.isDriver) {
      if (trip.to === undefined) {
        trip.to = to
        trip.date = date
        await trip.save()
        await bot.sendMessage(id, regTripPassText(tripFrom(trip.from), tripTo(trip.to), trip.date), {parse_mode: 'HTML'})
        await bot.sendMessage(id, 'Чтобы оформить новую заявку, нажмите /start')
      } else {
        await bot.deleteMessage(id, query.message.message_id)
      }
    }

  } catch (e) {
    console.log(e)
  }


}

module.exports = {
  pasTripFrom,
  pasTripTo
}