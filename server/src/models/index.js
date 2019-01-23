const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
const config = require('../config/config')
const Sequelize = require('sequelize')
const db = {}

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  config.db.options
)

fs.readdirSync(__dirname)
  .filter((file) => file !== basename)
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db
