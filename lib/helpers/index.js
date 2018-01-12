'use strict'

module.exports.debug = msg => {
  return JSON.stringify(msg, null, 4)
}

module.exports.keyboardTo = (isDriver, from) => {
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
  if (isDriver) {

  } else {
    let keyboard = keyboardTemplate.filter(item => {
      const word = item[0].callback_data.toLowerCase().slice(2)
      return word !== from
    })
    return keyboard
  }
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