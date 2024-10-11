const FavCripto = require('../models/FavCripto');
const User = require('../models/User');

module.exports = class FavCriptoController {

    static async saveFavCripto(crypto, userId) {
        try {
            // Verifica se a cripto já existe para o usuário
            const existingCripto = await FavCripto.findOne({
                where: {
                    nome: crypto,
                    UserId: userId
                }
            });

            // Se já existe, não salva novamente
            if (existingCripto) {
                console.log('A cripto já está salva como favorita.');
                return; // Ou você pode retornar uma mensagem se desejar
            }

            // Se não existe, cria uma nova entrada
            await FavCripto.create({
                nome: crypto,
                UserId: userId
            });
        } catch (error) {
            console.error('Erro ao salvar a cripto favorita:', error);
            throw error; // Propaga o erro
        }
    }



    static async showFavCripto(userId) {
        try {
            const data = await FavCripto.findAll({
                where: {
                    UserId: userId,
                },
                include: User, // Caso precise dos dados do usuário, se não, pode remover
            });

            const favCriptos = data.map(result => result.get({ plain: true }).nome);

            return favCriptos; // Retorna as criptos favoritas
        } catch (error) {
            console.error('Erro ao buscar as criptos favoritas:', error);
            throw error; // Propaga o erro
        }
    }

    static async removeFavCripto(crypto, userId) {
        try {
            const result = await FavCripto.destroy({
                where: {
                    nome: crypto,
                    UserId: userId
                }
            });
    
            if (result === 0) {
                console.log(`Nenhuma cripto favorita encontrada para remover: ${crypto}`);
            } else {
                console.log(`Cripto ${crypto} removida com sucesso!`);
            }
        } catch (error) {
            console.error('Erro ao remover a cripto favorita:', error);
            throw error; // Propaga o erro
        }
    }

}