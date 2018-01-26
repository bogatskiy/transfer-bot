'use strict'

const {driver, passenger} = require('./change_role')
const {driveTripFrom, driverPickUp, ignorePassenger} = require('./drivers')
const {pasTripFrom, pasTripTo} = require('./passengers')
const {stopTrip, continueTrip, wait} = require('./trips-edit')
const {isJson} = require('../helpers')

module.exports.query = query => {
  switch (query.data) {
    // Смена роли водитель/пассажир
    case 'driver':
      driver(query)
      break
    case 'passenger':
      passenger(query)
      break
    // Редактирование поездок
    case  'ignore':
      ignorePassenger(query)
      break
    case 'wait':
      wait(query)
      break
    case 'stopTrip':
      stopTrip(query)
      break
    case 'continueTrip':
      continueTrip(query)
      break
  }
}

module.exports.queryDriver = query => {
  if (isJson(query.data)) {
    const {cb} = JSON.parse(query.data)
    switch (cb) {
      case 'driverFrom':
        driveTripFrom(query)
        break
      case 'Up':
        driverPickUp(query)
        break
    }
  }

}

module.exports.queryPassenger = query => {
  if (isJson(query.data)) {
    const {cb} = JSON.parse(query.data)
    switch (cb) {
      case 'trip':
        pasTripFrom(query)
        break
      case 'tripTo':
        pasTripTo(query)
        break
    }
  }
}