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
router.post('/converter', HistoricosController.saveHistorico);

module.exports = router;