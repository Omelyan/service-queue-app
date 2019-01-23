module.exports = (sequelize, DataTypes) =>
  sequelize.define('User', {
    username: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    }
  })
