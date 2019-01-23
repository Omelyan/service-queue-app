const Joi = require('Joi')

module.exports = {

  signup (req, res, next) {
    const schema = {
      username: Joi.string().regex(/[\w]+$/).min(3).max(60),
      email: Joi.string().email({ minDomainAtoms: 2 }),
      password: Joi.string().min(8).max(24)
    }
    Joi.validate(req.body, schema, (error, value) => {
      if (error) {
        switch (error.details[0].context.key) {
          case 'username':
            res.status(400).send({ error: 'Invalid user name provided.' })
            break
          case 'email':
            res.status(400).send({ error: 'Invalid e-mail address provided.' })
            break
          case 'password':
            res.status(400).send({ error: 'Invalid password provided.' })
            break
          default:
            res.status(400).send({ error: 'Invalid sign up information provided.' })
        }
      } else {
        next()
      }
    })
  }

}
