// Server's default configuration
module.exports = {
  port: process.env.PORT || 8081,
  db: {
    database: process.env.DB_NAME || 'servicequeue-db',
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    options: {
      host: process.env.HOST || 'localhost',
      dialect: 'sqlite',
      storage: './squeue-db.sqlite'
    }
  }
}
