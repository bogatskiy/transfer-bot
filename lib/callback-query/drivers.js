'use strict'

const bot = require('../bot')
const mongoose = require('mongoose')
const Trip = mongoose.model('trip')
const User = mongoose.model('user')
const {tripFrom} = require('../helpers')

async function driveTripFrom(query) {
  const {id} = query.message.chat
  await bot.deleteMessage(id, query.message.message_id)
  const from = query.data.slice(0, -7)
  const trip = await Trip.find({from: from, completed: false})
  try {
    if (trip.length === 0) {
      await bot.sendMessage(query.message.chat.id, `Попутчиков ${tripFrom(from)} нет`)
      await bot.sendMessage(query.message.chat.id, `Чтобы проверить снова нажмите /start`)
    }
    else {
      await bot.sendMessage(query.message.chat.id, `Попутчики ${tripFrom(from)}`)
      await Promise.all(trip.map(async i => {
        const user = await User.findOne({id: i.id})
        await bot.sendContact(id, user.phone_number, user.first_name)
      }))
      await bot.sendMessage(query.message.chat.id, `Чтобы проверить снова нажмите /start`)
    }
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  driveTripFrom
}