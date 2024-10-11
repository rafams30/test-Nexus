const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const favCripto = db.define('favCripto', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
})

favCripto.belongsTo(User)
User.hasMany(favCripto)

module.exports = favCripto