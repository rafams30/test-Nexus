const { Sequelize }= require('sequelize')

const sequelize = new Sequelize('cripto', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3306
})

try{
    sequelize.authenticate()
    console.log('Conectamos com sucesso!')
}   catch(err){
    console.log(`Não foi possivel conectar: ${err}`)
}

module.exports = sequelize