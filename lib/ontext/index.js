'use strict'

const bot = require('../bot/index')

const mongoose = require('mongoose')
const User = mongoose.model('user')
const Trip = mongoose.model('trip')

const {tripFrom, tripTo, regTripPassText} = require('../helpers')

module.exports.sendContact = async msg => {
  const {id} = msg.chat

  if (msg.contact) {

    if (id === msg.contact.user_id) {

      const {phone_number, first_name, last_name, user_id} = msg.contact
      const user = new User({
        phone_number: phone_number,
        id: user_id,
        first_name: first_name,
        last_name: last_name
      })
      const doc = await User.findOne({id: user_id})

      if (!doc) {

        try {
          await user.save()
          await bot.sendMessage(id, 'Поздравляем, Вы успешно зарегестрировались! ', {
            reply_markup: {remove_keyboard: true}
          })
          await bot.sendMessage(id, 'Теперь укажите Вы "Водитель" или "Пассажир"?', {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Водитель',
                    callback_data: 'driver'
                  },
                  {
                    text: 'Пассажир',
                    callback_data: 'passenger'
                  }
                ]
              ]
            }
          })
        }
        catch (e) {
          console.error(e)
        }
      }

    } else {
      await bot.sendMessage(id, 'Сначала отправьте СВОЮ контактную информация! Без этого пользование ботом невозможно.')
    }

  } else {
    const newUser = await User.findOne({id: id})
    if (newUser === null && msg.text !== '/start') await bot.sendMessage(id, 'Сначала отправьте контактную информацию!')
  }
}
module.exports.start = async msg => {
  const {id} = msg.chat
  const {first_name, last_name} = msg.from
  let text = `Зравствуйте, ${first_name}
Для дальнейшего использования данным ботом Вам необходимо отправить контактную информацию.
`
  const user = await User.findOne({id: id})


  if (user === null) {
    try {
      await bot.sendMessage(id, text, {
        reply_markup: {
          keyboard: [
            [{
              text: 'Отправить контактную информацию',
              request_contact: true
            }]
          ]
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
  else {
    const trip = await Trip.findOne({id: user.id, completed: false})
    if (user.isDriver === undefined) {
      try {
        await bot.sendMessage(id, 'Вы "Водитель" или "Пассажир"?', {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Водитель',
                  callback_data: 'driver'
                },
                {
                  text: 'Пассажир',
                  callback_data: 'passenger'
                }
              ]
            ]
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
    else {
      if (user.isDriver) {
        try {
          await bot.sendMessage(id, 'Откуда Вы выезжаете?', {
            reply_markup: {
              inline_keyboard: [
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
          })
        } catch (e) {
          console.error(e)
        }
      }
      else {
        try {
          if (trip) {
            if (trip.to === undefined) {
              await bot.sendMessage(id, `Ранее вы начали оформлять заявку на выезд ${tripFrom(trip.from)}. Хотите продолжить оформление или начнем все заново?`, {
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: 'Продолжить оформление',
                        callback_data: 'continueTrip'
                      }
                    ],
                    [
                      {
                        text: 'Начать заново',
                        callback_data: 'stopTrip'
                      }
                    ]
                  ]
                }
              })
            }
            else {
              await bot.sendMessage(trip.id, regTripPassText(tripFrom(trip.from), tripTo(trip.to), trip.date, 'Хотите отменить заявку?'), {
                parse_mode: 'HTML',
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: 'Да',
                        callback_data: 'stopTrip'
                      },
                      {
                        text: 'Нет',
                        callback_data: 'wait'
                      }
                    ]
                  ]
                }
              })
            }
          }
          else {
            await bot.sendMessage(id, `Откуда Вы выезжаете?`, {
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
              },
              parse_mode: 'HTML'
            })
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}
module.exports.changeRoleOnText = async msg => {
  const {id} = msg.chat
  const user = await User.findOne({id: id})
  const whoText = (user.isDriver) ? 'Водитель' : 'Пассажир'
  const whoCallback = (user.isDriver) ? 'driver' : 'passenger'
  const whoTextNew = (!user.isDriver) ? 'Водитель' : 'Пассажир'
  const whoCallbackNew = (!user.isDriver) ? 'driver' : 'passenger'

  if (user === null) {
    try {
      await bot.sendMessage(id, 'Для начала использования бота, необходимо отправить контактные данные', {
        reply_markup: {
          keyboard: [
            [{
              text: 'Отправить контактную информацию',
              request_contact: true
            }]
          ],
          resize_keyboard: false
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  if (user.isDriver === undefined) {
    try {
      await bot.sendMessage(id, 'Кажется Вы немного торопите события. Для начала давайте выясним, Вы "Водитель" или "Пассажир"?', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Водитель',
                callback_data: 'driver'
              },
              {
                text: 'Пассажир',
                callback_data: 'passenger'
              }
            ]
          ]
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  else {
    try {
      await bot.sendMessage(id, `Вы зарегестрированны как ${whoText}. Хотите зарегестрироваться как ${whoTextNew}?`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Да',
                callback_data: whoCallbackNew
              },
              {
                text: 'Нет',
                callback_data: whoCallback
              }
            ]
          ]
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}
module.exports.help = async msg => {
  let html = `
<strong>${msg.chat.first_name}</strong>, если вы запутались и ничего не помогает, эта страница для Вас!

<b>Команда </b>/start<i> - поможет Вам начать новую поездку</i>

<b>Команда </b>/changerole<i> - сменит вашу роль если вы решили оставить руль или наоборот, хотите быть более мобильным и подвезти кого-нибудь</i>`
  try {
    await bot.sendMessage(msg.chat.id, html, {parse_mode: 'HTML'})
  } catch (e) {
    console.log(e)
  }
}