'use strict'

const moment = require('moment')

module.exports.debug = msg => JSON.stringify(msg, null, 4)

module.exports.keyboardTo = (from) => {
  const keyboardTemplate = [
    [{
      text: 'В Красную Поляну',
      callback_data: 'toKp'
    }],
    [{
      text: 'В Адлер',
      callback_data: 'toAdler'
    }],
    [{
      text: 'В Сочи',
      callback_data: 'toSochi'
    }]
  ]
  let keyboard = keyboardTemplate.filter(item => {
    const word = item[0].callback_data.toLowerCase().slice(2)
    return word !== from
  })
  return keyboard
}

module.exports.tripFrom = from => {
  switch (from) {
    case 'kp':
      return 'из Красной Поляны'
      break
    case 'adler':
      return 'из Адлера'
      break
    case 'sochi':
      return 'из Сочи'
      break
  }
}

module.exports.tripTo = to => {
  switch (to) {
    case 'kp':
      return 'в Красную Поляну'
      break
    case 'adler':
      return 'в Адлер'
      break
    case 'sochi':
      return 'в Сочи'
      break
  }
}

module.exports.regTripPassText = (from, to, date, optionalText) => {
  let time = moment(date).add(30, 'm').locale('ru').format('LTS')
  let text = optionalText ?
    `Вы оставили заявку на поездку:
<strong>${from} ${to}</strong>

<i>Заявка активна до </i><b>${time}</b>

${optionalText}`
    :
    `Вы оставили заявку на поездку:
<strong>${from} ${to}</strong>

<i>Заявка активна до </i><b>${time}</b>`
  return text
}

module.exports.isJson = data => {
  try {
    JSON.parse(data)
  } catch (e) {
    return false
  }
  return true
}
