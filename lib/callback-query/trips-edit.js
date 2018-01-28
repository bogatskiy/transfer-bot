'use strict'

const bot = require('../bot')
const mongoose = require('mongoose')
const Trip = mongoose.model('trip')
const User = mongoose.model('user')
const {kbTo, tripFrom, debug} = require('../helpers')

async function stopTrip(query) {
  try {
    const {id} = query.message.chat
    const user = await User.findOne({id})
    const trip = await Trip.findOne({id: user.id, completed: false})

    await bot.deleteMessage(id, query.message.message_id)

    if (trip) {
      trip.completed = true
      await trip.save()
      await bot.answerCallbackQuery(query.id, {text: 'Заявка удалена!', show_alert: true})
    }
  }
  catch (e) {
    console.log(e)
  }
}

async function continueTrip(query) {
  try {
    const {id} = query.message.chat
    const user = await User.findOne({id})
    const trip = await Trip.findOne({id: user.id, completed: false})
    await bot.sendMessage(user.id, `Куда выезжаем ${tripFrom(trip.from)}?`, {reply_markup: {inline_keyboard: kbTo('tripTo', trip.from)}})
    await bot.deleteMessage(id, query.message.message_id)
  }
  catch (e) {
    console.log(e)
  }
}

async function wait(query) {
  try {
    await bot.deleteMessage(query.message.chat.id, query.message.message_id)
    await bot.sendMessage(query.message.chat.id, 'Для создания новой заявки, нажмите /start')
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  stopTrip,
  continueTrip,
  wait
}