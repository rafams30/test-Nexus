const Historico = require('../models/Historico');
const User = require('../models/User');
const axios = require('axios');


module.exports = class HistoricosController {
    static async showHistoricos(req, res) {
        res.render('historico/form');
    }

    static async saveHistorico(req, res) {
        console.log('Dados recebidos:', req.body); // Verifica os dados recebidos
    
        const { crypto, amount, valueBRL, valueUSD } = req.body;
        const userId = req.session.userid; // Verifica se o userId está definido
    
        try {
            // Buscar os preços da cripto selecionada
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd,brl`);
            const prices = response.data[crypto];

            // Calcula os valores em BRL e USD
            const valueBRL = (amount * prices.brl).toFixed(2);
            const valueUSD = (amount * prices.usd).toFixed(2);

            // Renderiza o resultado no mesmo formulário
            res.render('historico/form', {
                result: {
                    amount,
                    crypto,
                    valueBRL,
                    valueUSD
                },
                cryptos: await axios.get('https://api.coingecko.com/api/v3/coins/list') // Recarrega a lista de criptomoedas
            });
        } catch (error) {
            console.error('Erro ao converter criptomoeda:', error);
            res.status(500).send('Erro ao converter criptomoeda');
        }

        console.log('User ID:', userId); // Verifica o userId
    
        /*
        try {
            await Historico.create({
                criptoName: crypto,
                valor_BRL: valueBRL,
                valor_USD: valueUSD,
                UserId: userId // Salva o ID do usuário
            });
            res.redirect('/'); // Redireciona após salvar
        } catch (error) {
            console.error('Erro ao salvar o histórico:', error); // Exibe o erro
            res.status(500).send('Erro ao salvar o histórico');
        }
            */
    }
}