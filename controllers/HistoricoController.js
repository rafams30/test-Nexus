const Historico = require('../models/Historico');
const User = require('../models/User');
const axios = require('axios');


module.exports = class HistoricosController {

    static async showHistoricos(req, res) {
        res.render('historico/form');
    }

    static async saveHistorico(crypto, valueBRL, valueUSD, userId) {
        //console.log('Dados recebidos:', req.body); // Verifica os dados recebidos
        
        try {
            await Historico.create({
                criptoName: crypto,
                valor_BRL: valueBRL,
                valor_USD: valueUSD,
                UserId: userId // Salva o ID do usuário
            });
        } catch (error) {
            console.error('Erro ao salvar o histórico:', error); // Exibe o erro
            res.status(500).send('Erro ao salvar o histórico');
        }
            
    }

    static showConsultas(req, res) {
        const userId = req.session.userid
        console.log(req.query)
        
        Historico.findAll({
            where: {
                UserId: userId,
              },
          include: User,
        })
          .then((data) => {
            let consultasQty = data.length
    
            if (consultasQty === 0) {
                consultasQty = false
            }
    
            const consultas = data.map((result) => result.get({ plain: true }))
    
            res.render('historico/userHistorico', { consultas, consultasQty })
          })
          .catch((err) => console.log(err))
      }
}