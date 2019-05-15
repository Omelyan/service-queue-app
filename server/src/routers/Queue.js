const express = require('express')
const QueueController = require('../controllers/QueueController')
const router = express.Router()

router.get('/updatesAfter/:date?', QueueController.getUpdatesAfter)
router.post('/update/:updateId?', QueueController.postUpdate)

module.exports = router
