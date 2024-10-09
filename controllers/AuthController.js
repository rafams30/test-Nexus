const { where } = require('sequelize')
const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const {email, password} = req.body

        //Encontrando User
        const user = await User.findOne({where: {email: email}})
        if(!user) {
            req.flash('message', 'Usuário não encontrado!')
            res.render('auth/login')

            return
        }
        //Checando senha
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch) {
            req.flash('message', 'Senha inválida!')
            res.render('auth/login')

            return
        }

        req.session.userid = user.id

        req.flash('message', 'Autenticação realizada com sucesso!')

        req.session.save(() => {
            res.redirect('historicos/converter')
        })


    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {

        const { name, email, password, confirmpassword } = req.body

        //confirmação de senha
        if (password != confirmpassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')

            return
        }

        // email validation
        const checkIfUserExists = await User.findOne({ where: { email: email } })

        if (checkIfUserExists) {
            req.flash('message', 'O e-mail já está em uso!')
            res.render('auth/register')

            return
        }


        //Criando a senha
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword,
        }

        User.create(user)
            .then((user) => {
                // iniciando a seção
                req.session.userid = user.id

                // console.log('salvou dado')
                // console.log(req.session.userid)

                req.session.userid = user.id

                req.flash('message', 'Cadastro realizado com sucesso!')

                req.session.save(() => {
                    res.redirect('historicos/converter')
                })
            })
            .catch((err) => console.log(err))
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}
