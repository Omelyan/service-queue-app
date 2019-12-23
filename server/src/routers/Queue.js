const express = require('express')
const router = express.Router()

const QueueController = require('../controllers/QueueController')
const Ads = require('../controllers/Ads')

// Queue's list:
router.get('/updatesAfter/:date?', QueueController.getUpdatesAfter)
router.post('/update/:updateId?', QueueController.postUpdate)

// Ads:
router.get('/video', Ads.getVideo)

module.exports = router
