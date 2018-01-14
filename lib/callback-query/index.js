'use strict'

const { driver, passenger } = require('./change_role')
const { driveTripFrom } = require('./drivers')
const { pasTripFrom, pasTripTo } = require('./passengers')
const { stopTrip, continueTrip, wait  } = require('./trips-edit')

module.exports.query = async query => {
  switch (query.data) {
    // Водители пункт отправления
    case  'kp_driver':
      driveTripFrom(query)
      break
    case  'adler_driver':
      driveTripFrom(query)
      break
    case  'sochi_driver':
      driveTripFrom(query)
      break
    // Пассажиры пункт отправления
    case 'kp':
      pasTripFrom(query)
      break
    case 'adler':
      pasTripFrom(query)
      break
    case 'sochi':
      pasTripFrom(query)
      break
    // Пассажиры пункт назначения
    case 'toKp':
      pasTripTo(query)
      break
    case 'toAdler':
      pasTripTo(query)
      break
    case 'toSochi':
      pasTripTo(query)
      break
    // Смена роли водитель/пассажир
    case 'driver':
      driver(query)
      break
    case 'passenger':
      passenger(query)
      break
    // Редактирование поездок
    case 'stopTrip':
      stopTrip(query)
      break
    case 'continueTrip':
      continueTrip(query)
      break
    case 'wait':
      wait(query)
      break
  }
}