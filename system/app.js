const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const config = require('../.config/webpack.config.js')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const logger = require('morgan') 
const cors = require('cors')
const app = express()
const port = 3001

app.set('views', './system/views')
app.set('view engine', 'ejs')

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger('dev'))
app.use(express.static(path.resolve(__dirname, '../dist')))

const options = {
    port: 3000,
    index: '',
    proxy: {
        '/': {
            context: () => true,
            target: 'http://localhost:3001'
        }
    },
    quiet: true,
    host: 'localhost',
    contentBase: path.join(__dirname, './views'),
    watchContentBase: true,
}

webpackDevServer.addDevServerEntrypoints(config, options)
const compiler = webpack(config)
const server = new webpackDevServer(compiler, options)


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/user', (req, res) => {
    res.send('his')
})

server.listen(3000, 'localhost', () => {
    console.log(
        chalk['green'].bold('webpack server listening on port 3000') +
        '\n'
    )
})

app.listen(port, () => {
    console.log(
        '\n\n' +
        chalk['red'].bold(`express server listening on port ${port}`) +
        '\n'
    )
})
