'use strict'

const bot = require('../bot')
const moment = require('moment')

const mongoose = require('mongoose')
const Trip = mongoose.model('trip')
const User = mongoose.model('user')

const {keyboardTo, tripFrom, tripTo, regTripPassText} = require('../helpers')

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

// refactoring async/await driver

function driver(query) {


  const {id} = query.message.chat
  bot.deleteMessage(id, query.message.message_id)
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

<<<<<<< HEAD
  bot.deleteMessage(id, query.message.message_id)

=======
>>>>>>> 3f30d1cd84a0164d183cda61ea5cf64243ccd7bd
  new Promise(async () => {
    let user = await User.findOne({id: id})

    if (user.isDriver !== false) {
      user.isDriver = false
      await user.save()

      try {

        let trip = await Trip.findOne({id: user.id, completed: false})
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
          console.log(trip)
        }

      } catch (e) {
        console.log(e)
      }


    }
    else {
      await bot.sendMessage(id, 'Вы зарегестрировались как "Пассажир". Откуда Вы выезжаете?', {reply_markup: {inline_keyboard: changeRoleKeybord.passenger}})
    }

  }).catch(e => console.log(e))


}

function pasTripFrom(query) {

  const {id, first_name} = query.message.chat

  let newTrip = new Trip({
    id: id,
    first_name: first_name,
    from: query.data
  })

  User.findOne({id}).then(async user => {
    await bot.deleteMessage(id, query.message.message_id)
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
  const date = new Date(query.message.date * 1000)

  const to = query.data.toLowerCase().slice(2)

  Trip.findOne({id, completed: false}).then(async trip => {
<<<<<<< HEAD
    await bot.deleteMessage(id, query.message.message_id)
=======
>>>>>>> 3f30d1cd84a0164d183cda61ea5cf64243ccd7bd

    if (trip.to === undefined) {

      trip.to = to
      trip.date = date
      await trip.save()
      trip = await Trip.findOne({id, completed: false})
      await bot.sendMessage(id, regTripPassText(tripFrom(trip.from), tripTo(trip.to), trip.date), {parse_mode: 'HTML'})
<<<<<<< HEAD
      await bot.sendMessage(id, 'Чтобы оформить новую заявку, нажмите /start')
    } else {
      await bot.sendMessage(id, regTripPassText(tripFrom(trip.from), tripTo(trip.to), trip.date), {parse_mode: 'HTML'})
      await bot.sendMessage(id, 'Что бы оформить новую заявку, нажмите /start')
=======

>>>>>>> 3f30d1cd84a0164d183cda61ea5cf64243ccd7bd

    }
  })

}

function stopTrip(query) {
  const {id} = query.message.chat

  User.findOne({id}).then(async user => {
    await bot.deleteMessage(id, query.message.message_id)

    const trip = await Trip.findOne({id: user.id})
<<<<<<< HEAD
    console.log(trip)
    await trip.remove()
    await bot.sendMessage(user.id, 'Заявка удалена! Чтобы оформить новую заявку, нажмите /start')
=======

>>>>>>> 3f30d1cd84a0164d183cda61ea5cf64243ccd7bd

  })
}

function continueTrip(query) {
  const {id} = query.message.chat

  bot.deleteMessage(id, query.message.message_id)

  User.findOne({id}).then(async user => {
    const trip = await Trip.findOne({id: user.id})
    await  bot.sendMessage(user.id, `Куда выезжаем ${tripFrom(trip.from)}?`, {reply_markup: {inline_keyboard: keyboardTo(user.isDriver, trip.from)}})
  })

}

function driveTripFrom(query) {

  const {id} = query.message.chat

<<<<<<< HEAD
  bot.deleteMessage(id, query.message.message_id)

  const from = query.data.slice(0, -7)

  new Promise(async () => {
=======

>>>>>>> 3f30d1cd84a0164d183cda61ea5cf64243ccd7bd
    try {
      const trip = await Trip.find({from: from, completed: false})
      if (trip.length === 0) {
        await bot.sendMessage(query.message.chat.id, `Попутчиков ${tripFrom(from)} нет`)
<<<<<<< HEAD
        await bot.sendMessage(query.message.chat.id, `Чтобы проверить снова нажмите /start`)

      } else {

        await bot.sendMessage(query.message.chat.id, `Попутчики ${tripFrom(from)}`)

        await trip.forEach(async (i) => {
          let user = await User.findOne({id: i.id})
          await bot.sendContact(id, user.phone_number, user.first_name)
        })

        await bot.sendMessage(query.message.chat.id, `Чтобы проверить снова нажмите /start`)

      }
    } catch (e) {console.error(e)}
  }).catch(e => console.log(e))

}

function wait(query) {
  bot.deleteMessage(query.message.chat.id, query.message.message_id)
  bot.sendMessage(query.message.chat.id, 'Для создания новой заявки, нажмите /start')
=======

>>>>>>> 3f30d1cd84a0164d183cda61ea5cf64243ccd7bd
}

module.exports = {
  stopTrip,
  continueTrip,
  driver,
  passenger,
  pasTripFrom,
  pasTripTo,
  driveTripFrom,
  wait
}