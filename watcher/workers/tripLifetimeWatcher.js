module.exports = async function dbWatcher({bot, mongoose}) {

  const Trip = mongoose.model('trip')
  const nowDate = new Date().getTime()

  const trips = await Trip.find({completed: false})

  if (trips.length > 0) {
    await Promise.all(
      trips.map(async trip => {
        if (trip.to !== undefined) {
          const tripDate = new Date(trip.date).getTime()
          if (nowDate - tripDate >= 1800000) {
            trip.completed = true
            await trip.save()
            await bot.sendMessage(trip.id, 'Время вашей заявки истекло! Для оформления новой заявки нажмите /start')
          }
        }
      })
    )
  }
}