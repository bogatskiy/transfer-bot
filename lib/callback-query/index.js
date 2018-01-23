'use strict'

const {driver, passenger} = require('./change_role')
const {driveTripFrom, driverPickUp, ignorePassenger} = require('./drivers')
const {pasTripFrom, pasTripTo} = require('./passengers')
const {stopTrip, continueTrip, wait} = require('./trips-edit')
const {isJson} = require('../helpers')

module.exports.query = query => {
  switch (query.data) {

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

// Водители
module.exports.queryDriver = query => {
  switch (query.data) {
    case  'kp_driver':
      driveTripFrom(query)
      break
    case  'adler_driver':
      driveTripFrom(query)
      break
    case  'sochi_driver':
      driveTripFrom(query)
      break
    case  'ignore':
      ignorePassenger(query)
      break
  }
  if (isJson(query.data)) {
    const {cb} = JSON.parse(query.data)
    switch (cb) {
      case 'Up':
        driverPickUp(query)
        break
    }
  }
}
