const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const Historico = db.define('Historico', {
    criptoName: {
        type: DataTypes.STRING,
        allowNull: false // Corrigido
    },
    valor_BRL: {
        type: DataTypes.FLOAT,
        allowNull: false // Corrigido
    },
    valor_USD: {
        type: DataTypes.FLOAT,
        allowNull: false // Corrigido
    },
})


Historico.belongsTo(User)
User.hasMany(Historico)

module.exports = Historico