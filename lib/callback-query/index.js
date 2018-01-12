'use strict'

const bot = require('../bot')
const moment = require('moment')

const mongoose = require('mongoose')
const Trip = mongoose.model('trip')
const User = mongoose.model('user')

const {keyboardTo, tripFrom, tripTo, debug} = require('../helpers')

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

function driver(query) {
  const {id} = query.message.chat
  User.findOne({id: id}).then(data => {
    if (data.isDriver !== true) {
      data.isDriver = true
      data.save()
      bot.sendMessage(id, 'Вы зарегестрировались как "Водитель". Откуда Вы выезжаете?', {
        reply_markup: {inline_keyboard: changeRoleKeybord.driver}
      })
    } else {
      bot.sendMessage(id, 'Вы зарегестрировались как "Водитель". Откуда Вы выезжаете?', {
        reply_markup: {inline_keyboard: changeRoleKeybord.driver}
      })
    }
  })
}

function passenger(query) {
  const {id} = query.message.chat
  User.findOne({id: id}).then(data => {
    if (data.isDriver !== false) {
      data.isDriver = false
      data.save().catch(e => console.log(e))
      bot.sendMessage(id, 'Вы зарегестрировались как "Пассажир". Откуда Вы выезжаете?', {
        reply_markup: {inline_keyboard: changeRoleKeybord.passenger}
      })
    } else {
      bot.sendMessage(id, 'Вы зарегестрировались как "Пассажир". Откуда Вы выезжаете?', {
        reply_markup: {inline_keyboard: changeRoleKeybord.passenger}
      })
    }
  })
}

function pasTripFrom(query) {

  const {id, first_name} = query.message.chat

  let newTrip = new Trip({
    id: id,
    first_name: first_name,
    from: query.data
  })

  User.findOne({id}).then(async user => {
    let trip = await Trip.findOne({id})
    if (user.isDriver) {

    }
    else {
      if (trip === null) {
        await newTrip.save()
        await bot.sendMessage(id, 'Куда Вы направляетесь?', {reply_markup: {inline_keyboard: keyboardTo(user.isDriver, query.data)}})
      }
      else {
        if (trip.from === query.data) {
          await bot.sendMessage(id, `Куда выезжаем ${tripFrom(trip.from)}?`, {reply_markup: {inline_keyboard: keyboardTo(user.isDriver, query.data)}})
        } else {
          if (trip.to === undefined) await bot.sendMessage(id, `Передумали выезжать ${tripFrom(trip.from)}?`, {
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
      }
    }
  })
}

function pasTripTo(query) {

  const {id, first_name} = query.message.chat
  const date = query.message.date

  const to = query.data.toLowerCase().slice(2)

  function text(from, to) {
    let time = moment().add(15, 'm').locale('ru').format('LT')
    let text =
      `<i>Вы забронировали поездку</i>
<strong>${from} ${to}</strong>

<i>Заявка действительна до </i><b>${time}</b>`
    return text
  }

  Trip.findOne({id, completed: false}).then(async trip => {


    if (trip.to === undefined) {

      trip.to = to
      trip.date = Date(date)
      await trip.save()
      trip = await Trip.findOne({id, completed: false})
      await bot.sendMessage(query.message.chat.id, text(tripFrom(trip.from), tripTo(trip.to)), {parse_mode: 'HTML'})
      await trip.remove()
    } else {
      await bot.sendMessage(query.message.chat.id, text(tripFrom(trip.from), tripTo(trip.to)), {parse_mode: 'HTML'})
    }
  })

//   Trip.findOne({id: id, completed: false}).then(data => {
//
//
//
//   if (data.to === undefined) {
//     data.to = to
//     data.date = Date(date)
//     data.save()
//       .then(data => {
//         bot.sendMessage(query.message.chat.id, text(data.from, data.to), {parse_mode: 'HTML'}).catch(e => {
//           console.log(e)
//         })
//         return data
//       })
//       .then(data => {
//         // data.remove()
//       })
//       .catch(e => console.log(e))
//   }
// })

}

function stopTrip(query) {
  const {id} = query.message.chat

  User.findOne({id}).then(async user => {
    const trip = await Trip.findOne({id: user.id})
    if (!trip.to) {
      if (trip) trip.remove()
      await bot.sendMessage(user.id, 'Попробуем снова. Откуда едем?', {
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
  })

}

function continueTrip(query) {
  const {id} = query.message.chat

  User.findOne({id}).then(async user => {
    const trip = await Trip.findOne({id: user.id})
    await  bot.sendMessage(user.id, `Куда выезжаем ${tripFrom(trip.from)}?`, {reply_markup: {inline_keyboard: keyboardTo(user.isDriver, trip.from)}})
  })

}

function driveTripFrom(query, from) {

  const {id} = query.message.chat

  Trip.find({from: from, completed: false})
    .then(data => {
      if (data.length === 0) {
        bot.sendMessage(query.message.chat.id, `Попутчиков ${from} нет`).catch(e => console.error(e))
      } else {
        bot.sendMessage(query.message.chat.id, `Попутчики ${from}`).catch(e => console.error(e))
      }

      return data
    })
    .then(data => {
      data.forEach((i) => {
        User.findOne({id: i.id}).then(user => {
          bot.sendContact(id, user.phone_number, user.first_name).catch(e => console.error(e))
        })
      })
    })
    .catch(e => console.error(e))
}

module.exports = {
  stopTrip,
  continueTrip,
  driver,
  passenger,
  pasTripFrom,
  pasTripTo,
  driveTripFrom
}