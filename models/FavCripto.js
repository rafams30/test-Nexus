const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const favCripto = db.define('favCripto', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
    valor_BRL: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        require: true,
    },
    valor_USD: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        require: true,
    },
})

favCripto.belongsTo(User)
User.hasMany(favCripto)

module.exports = favCripto