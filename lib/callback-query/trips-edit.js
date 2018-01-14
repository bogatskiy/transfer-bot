'use strict'

const bot = require('../bot')
const mongoose = require('mongoose')
const Trip = mongoose.model('trip')
const User = mongoose.model('user')
const {keyboardTo, tripFrom} = require('../helpers')

async function stopTrip(query) {
  const {id} = query.message.chat
  const user = await User.findOne({id})
  const trip = await Trip.findOne({id: user.id})

  await bot.deleteMessage(id, query.message.message_id)
  await trip.remove()
  await bot.sendMessage(user.id, 'Заявка удалена! Чтобы оформить новую заявку, нажмите /start')
}

async function continueTrip(query) {
  const {id} = query.message.chat
  const user = await User.findOne({id})
  const trip = await Trip.findOne({id: user.id})

  await bot.deleteMessage(id, query.message.message_id)
  await bot.sendMessage(user.id, `Куда выезжаем ${tripFrom(trip.from)}?`, {reply_markup: {inline_keyboard: keyboardTo(trip.from)}})
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