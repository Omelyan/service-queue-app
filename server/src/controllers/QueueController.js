const queue = []

let timeStamp = 0
let nextUpdateId = 0

function left (left, updated, time) {
  return left - (time - updated) / 60000
}

function updateQueueItem (data, time) {
  if (data.cID === undefined || data.plate === undefined || typeof (data.left) !== 'number') {
    return false
  }

  const plate = data.plate.toUpperCase().match(/[A-ZА-Я]+|[0-9]+/g).join(' ').substring(0, 10)
  if (plate.length < 4) {
    return false
  }

  const item = queue.find(item => item.cID === data.cID)
  if (item) {
    // update
    const difference = data.left - left(item.left, item.updated, time)
    item.left = data.left
    item.state = data.state
    item.plate = plate
    item.symbol = difference > 15 ? 8613 : difference < -15 ? 8615 : 0
    item.updated = time
  } else {
    // new one
    queue.push({
      cID: data.cID,
      left: data.left,
      state: data.state,
      plate: plate,
      symbol: 0,
      updated: time
    })
  }

  return true
}

// sanitize queue every hour
setInterval(function () {
  const currentTime = Date.now()

  for (let index = queue.length; index--;) {
    if (left(queue[index].left, queue[index].updated, currentTime) < -90) {
      queue.splice(index, 1)
    }
  }
}, 60 * 60 * 1000)

module.exports = {
  async getUpdatesAfter (req, res) {
    const date = Number(req.params.date) || 0

    if (date >= timeStamp || queue.length === 0) {
      res.status(204).end()
    } else {
      res.json({
        items: queue.filter(item => item.updated > date),
        timeStamp: Date.now()
      })
    }
  },

  async postUpdate (req, res) {
    const updateId = Number(req.params.updateId) || 0
    const currentTime = Date.now()

    let success = false

    if (Array.isArray(req.body)) {
      for (const data of req.body) {
        success = updateQueueItem(data, currentTime) || success
      }
    } else {
      success = updateQueueItem(req.body, currentTime)
    }

    if (success) {
      if (updateId === nextUpdateId) {
        res.status(200).end()
        nextUpdateId += 1
      } else {
        res.status(205).end()
        nextUpdateId = 0
      }
      timeStamp = currentTime
    } else {
      // unsuccessfully
      res.status(400).end()
    }
  }
}
