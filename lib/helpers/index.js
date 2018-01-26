'use strict'

const moment = require('moment')

const tripPoints = [
  {
    id: 100,
    from: 'из Красной Поляны',
    to: 'в Красную Поляну'
  },
  {
    id: 200,
    from: 'из Адлера',
    to: 'в Адлер'
  },
  {
    id: 300,
    from: 'из Сочи',
    to: 'в Сочи'
  }
]

const debug = msg => JSON.stringify(msg, null, 4)

const isJson = data => {
  try {
    JSON.parse(data)
  } catch (e) {
    return false
  }
  return true
}

const kbFrom = (cb) => {
  let kb = []
  tripPoints.map(item => {
    kb.push([{
      text: tripFrom(item.id),
      callback_data: JSON.stringify({cb: cb, from: item.id})
    }])
  })
  return kb
}

const kbTo = (cb, from) => {
  let kb = []
  tripPoints
    .filter(item => item.id !== from)
    .map(item => {
      const key = [{
        text: tripTo(item.id),
        callback_data: JSON.stringify({cb: cb, to: item.id})
      }]
      kb.push(key)
    })
  return kb
}

const tripFrom = from => {
  const point = tripPoints.filter(item => {
    return item.id === from
  })
  return point[0].from
}

const tripTo = to => {
  const point = tripPoints.filter(item => {
    return item.id === to
  })
  return point[0].to
}

const regTripPassText = (from, to, date, optionalText) => {
  let time = moment(date).add(30, 'm').locale('ru').format('LTS')
  let text = optionalText ?
    `Вы оставили заявку на поездку:
<strong>${tripFrom(from)} ${tripTo(to)}</strong>

<i>Заявка активна до </i><b>${time}</b>

${optionalText}`
    :
    `Вы оставили заявку на поездку:
<strong>${from} ${to}</strong>

<i>Заявка активна до </i><b>${time}</b>`
  return text
}

module.exports = {
  debug,
  isJson,
  kbFrom,
  kbTo,
  tripFrom,
  tripTo,
  regTripPassText
}