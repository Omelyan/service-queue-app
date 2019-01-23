const { User } = require('../models')

module.exports = {
  async signup (req, res) {
    try {
      const user = await User.create(req.body)
      res.send(user.toJSON())
    } catch (error) {
      res.status(400).send({ error: 'Can\'t create user account. Maybe this e-mail is already in use.' })
    }
  }
}
