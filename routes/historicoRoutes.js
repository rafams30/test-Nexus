const express = require('express');
const router = express.Router();
const HistoricosController = require('../controllers/HistoricoController');
const axios = require('axios'); // Importando o axios para usar na rota GET

// Rota para mostrar o formulário
//router.get('/', HistoricosController.showHistoricos);

// Rota para carregar o formulário
router.get('/converter', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
        const cryptos = response.data;


        res.render('historico/form', { cryptos });
    } catch (error) {
        console.error('Erro ao buscar criptomoedas:', error);
        res.status(500).send('Erro ao buscar criptomoedas');
    }
});

// Rota para salvar o histórico
router.post('/converter', async (req, res) => {
    const { crypto, amount } = req.body;
    const userId = req.session.userid; // Verifica se o userId está definido
    
        try {
            // Buscar os preços da cripto selecionada
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd,brl`);
            const prices = response.data[crypto];
            console.log('Preços da criptomoeda:', prices);

            // Calcula os valores em BRL e USD
            const valueBRL = (amount * prices.brl).toFixed(2);
            const valueUSD = (amount * prices.usd).toFixed(2);

            await HistoricosController.saveHistorico(crypto, valueBRL, valueUSD, userId);
            
            // Recarrega a lista de criptomoedas
            const cryptosResponse = await axios.get('https://api.coingecko.com/api/v3/coins/list');
            const cryptos = cryptosResponse.data;

            // Renderiza o resultado no mesmo formulário
            res.render('historico/form', {
                result: {
                    amount,
                    crypto,
                    valueBRL,
                    valueUSD
                },
                cryptos
               // cryptos: await axios.get('https://api.coingecko.com/api/v3/coins/list') // Recarrega a lista de criptomoedas
            });
            //res.redirect('/historicos/converter'); // Redireciona após salvar
        } catch (error) {
            console.error('Erro ao converter criptomoeda:', error);
            res.status(500).send('Erro ao converter criptomoeda');
        }

        console.log('User ID:', userId); // Verifica o userId
        console.log('Body:', req.body);
});


router.get('/consultas', HistoricosController.showConsultas);

module.exports = router;