const express = require('express');
const router = express.Router();
const HistoricosController = require('../controllers/HistoricoController');
const FavCripto = require('../controllers/FavoriteCriptoController');
const axios = require('axios'); // Importando o axios para usar na rota GET
const FavCriptoController = require('../controllers/FavoriteCriptoController');
const { checkAuth } = require('../helpers/auth');

// Rota para mostrar o formulário
//router.get('/', HistoricosController.showHistoricos);

// Rota para carregar o formulário
router.get('/converter', checkAuth, async (req, res) => {
    try {
        const userId = req.session.userid;
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
        const cryptos = response.data;

        const favorites = await FavCriptoController.showFavCripto(userId);

        res.render('historico/form', { cryptos, favorites });
    } catch (error) {
        console.error('Erro ao buscar criptomoedas:', error);
        res.status(500).send('Erro ao buscar criptomoedas');
    }
});

// Rota para salvar o histórico
router.post('/converter', checkAuth, async (req, res) => {
    const { crypto, amount, favorite } = req.body;
    const userId = req.session.userid; // Verifica se o userId está definido
    
        try {
            // Buscar os preços da cripto selecionada
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd,brl`);
            const prices = response.data[crypto];
            console.log('Preços da criptomoeda:', prices);

            // Calcula os valores em BRL e USD
            const valueBRL = (amount * prices.brl).toFixed(2);
            const valueUSD = (amount * prices.usd).toFixed(2);

            if(favorite) {
                await FavCripto.saveFavCripto(crypto, userId);
            }

            await HistoricosController.saveHistorico(crypto, valueBRL, valueUSD, userId);
            
            // Recarrega a lista de criptomoedas
            const cryptosResponse = await axios.get('https://api.coingecko.com/api/v3/coins/list');
            const cryptos = cryptosResponse.data;
             
            // Recarrega a lista de criptomoedas favoritas
            const favorites = await FavCriptoController.showFavCripto(userId);

            // Renderiza o resultado no mesmo formulário
            res.render('historico/form', {
                result: {
                    amount,
                    crypto,
                    valueBRL,
                    valueUSD
                },
                cryptos,
                favorites
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

router.post('/favoritos/remover', checkAuth, async (req, res) => {
    const { crypto } = req.body; // Obtém o nome da cripto a ser removida
    const userId = req.session.userid;

    try {
        // Chama o método de remoção no controlador
        await FavCriptoController.removeFavCripto(crypto, userId);
        
        // Redireciona de volta para a página de favoritos ou atualiza a lista
        res.redirect('/historicos/converter'); // Redireciona para o formulário, atualizando a lista
    } catch (error) {
        console.error('Erro ao remover cripto favorita:', error);
        res.status(500).send('Erro ao remover cripto favorita');
    }
});

module.exports = router;