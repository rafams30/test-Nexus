const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const axios = require('axios');

const app = express()

const conn = require('./db/conn')

//Models
const favCripto = require('./models/FavCripto')
const User = require('./models/User')
const Historico = require('./models/Historico')

//Import Routes
const historicoRoutes = require('./routes/historicoRoutes')
const authRoutes = require('./routes/authRoutes')


// Import Controller
const HistoricosController = require('./controllers/HistoricoController')
const AuthController = require('./controllers/AuthController')


app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended:true
    })
)

app.use(express.json())

app.use(
    session({
        name:"session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    }),
)

//Flash Messages
app.use(flash())

app.use(express.static('public'))

app.use((req, res, next) => {

    if(req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

//Routes
app.use('/historicos', historicoRoutes);
app.use('/historicos/converter', historicoRoutes); // Isso torna '/historicos/converter' disponível
app.use('/', authRoutes)

app.get('/', AuthController.login)

console.log('Rotas registradas:');
app._router.stack.forEach((route) => {
    if (route.route) {
        console.log(route.route.path, route.route.methods);
    }
});



conn
    .sync({})
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => console.log(err))