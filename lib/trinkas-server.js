'use strict'

let path = require('path');


const express = require('express');

const routesApi = require('./routes/trinkas-web-api');
const routesWeb = require('./routes/trinkas-web-app');
const routesAuth = require('./routes/trinkas-web-auth');

const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('passport')
const bodyParser = require('body-parser');

const PORT = 8080;

let server;

function initServer(port = PORT, isElasticSearch, done) {
    const app = express()

    routesApi.setDb(isElasticSearch)

    //view engine setup
    app.set('view engine', 'hbs');      //tell express which template engine we´re using
    app.set('views', './views')         //say where we can find the views

    //login setup
    app.use(flash())
    app.use(session({
        secret: "shhhhhhItsASecret",
        resave: false,
        saveUninitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(methodOverride('_method'))
    app.use(bodyParser.urlencoded({ extended: true }));

    //routes setup
    app.use('/api', routesApi.router);
    app.use(routesWeb.router);
    app.use(routesAuth);
    app.use(express.static('public'));
    app.use(express.json)



    //start server
    return server = app.listen(port, () => {
        console.log(`Listening on Port ${port}`);
        if(done) done();
    });
}
function killServer(server, onClose) {
    server.close(onClose);
}

module.exports = {initServer, killServer}