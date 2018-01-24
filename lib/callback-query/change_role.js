'use strict'

const bot = require('../bot')
const mongoose = require('mongoose')
const Trip = mongoose.model('trip')
const User = mongoose.model('user')

const {tripFrom, tripTo, regTripPassText} = require('../helpers')

let changeRoleKeybord = {
  passenger: [
    [{
      text: 'Из Красной Поляны',
      callback_data: 'kp'
    }],
    [{
      text: 'Из Адлера',
      callback_data: 'adler'
    }],
    [{
      text: 'Из Сочи',
      callback_data: 'sochi'
    }]
  ],
  driver: [
    [{
      text: 'Из Красной Поляны',
      callback_data: 'kp_driver'
    }],
    [{
      text: 'Из Адлера',
      callback_data: 'adler_driver'
    }],
    [{
      text: 'Из Сочи',
      callback_data: 'sochi_driver'
    }]
  ]
}

async function driver(query) {

  try {
    const {id} = query.message.chat
    const user = await User.findOne({id})
    const trip = await Trip.findOne({id, completed: false})

    await bot.deleteMessage(id, query.message.message_id)

    if (!user.isDriver) {
      user.isDriver = true
      trip.completed = true
      await trip.save()
      await user.save()
      await bot.sendMessage(id, 'Вы зарегестрировались как "Водитель". Откуда Вы выезжаете?', {
        reply_markup: {inline_keyboard: changeRoleKeybord.driver}
      })
    }
    else {
      await bot.sendMessage(id, 'Вы зарегестрировались как "Водитель". Откуда Вы выезжаете?', {
        reply_markup: {inline_keyboard: changeRoleKeybord.driver}
      })
    }
  }
  catch (e) {
    console.log(e)
  }
}

async function passenger(query) {
  const {id} = query.message.chat
  try {

    const user = await User.findOne({id: id})
    const trip = await Trip.findOne({id: user.id, completed: false})
    await bot.deleteMessage(id, query.message.message_id)

    if (user.isDriver === undefined) {
      user.isDriver = false
      await user.save()
      await bot.sendMessage(id, 'Чтобы оформить новую заявку, нажмите /start')
    }
    else {
      if (user.isDriver) {
        user.isDriver = false
        await user.save()
        if (trip) {
          if (trip.to === undefined) {
            await bot.sendMessage(id, `Передумали выезжать ${tripFrom(trip.from)}?`, {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Да',
                      callback_data: 'stopTrip'
                    },
                    {
                      text: 'Нет',
                      callback_data: 'continueTrip'
                    }
                  ]
                ]
              }
            })
          }
          else {
            await bot.sendMessage(trip.id, regTripPassText(tripFrom(trip.from), tripTo(trip.to), trip.date), {parse_mode: 'HTML'})
            await bot.sendMessage(id, 'Чтобы оформить новую заявку, нажмите /start')
          }
        }
        else {
          await bot.sendMessage(id, 'Откуда Вы выезжаете?', {
            reply_markup: {
              inline_keyboard: [
                [{
                  text: 'Из Красной Поляны',
                  callback_data: 'kp'
                }],
                [{
                  text: 'Из Адлера',
                  callback_data: 'adler'
                }],
                [{
                  text: 'Из Сочи',
                  callback_data: 'sochi'
                }]
              ]
            }
          })
        }
      }
      else {
        if (!trip) {
          await bot.sendMessage(id, 'Вы и так "Пассажир"! Двайте уже куда-нибудь поедем! Откуда Вы выезжаете?', {reply_markup: {inline_keyboard: changeRoleKeybord.passenger}})
        } else {
          await bot.sendMessage(id, regTripPassText(tripFrom(trip.from), tripTo(trip.to), trip.date, 'Чтобы оформить новую заявку, нажмите /start'), {parse_mode: 'HTML'})
        }
      }
    }
  }

  catch (e) {
    console.log(e)
  }
}

module.exports = {
  driver,
  passenger
}