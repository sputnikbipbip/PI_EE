'use strict'

const services = require('../trinkas-services')
const bodyParser = require('body-parser')
const passport = require('passport')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const initializePassport = require('../passport-config')

const Router = require('express').Router
const router = Router()

module.exports = router


initializePassport(
    passport,
    services.getUserByEmail,
    services.getUserById)


router.get('/trinkas/login', checkNotAuthenticated, (req, res) => res.render('login.hbs'))

router.get('/trinkas', checkAuthenticated, urlencodedParser, (req, res) => {
        res.render('homepage.hbs');
    })

router.post('/trinkas/login', checkNotAuthenticated, urlencodedParser, passport.authenticate('local', {
        successRedirect: '/trinkas',
        failureRedirect: '/trinkas/login',
        failureFlash: 'Incorrect user email or password',
        successFlash: 'Login successful'
    }
))

router.get('/trinkas/register', checkNotAuthenticated, (req, res) => res.render('register.hbs'))

router.post('/trinkas/register', checkNotAuthenticated, urlencodedParser, (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    services.addUser(name, email, password, (err, users) =>{
        if(err){
            const error = new Error("This email is already in use")
            error.status = 409;

            res.render('register.hbs', {
                'messages': {
                    'error': error
                }
            })
        }
        else{
            res.redirect('/trinkas');
        }


    })})

router.delete('/trinkas/logout', (req, res) => {
    req.logOut()
    res.redirect('/trinkas/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/trinkas/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/trinkas')
    }
    return next()
}

router.get('/trinkas', checkAuthenticated, (req, res) => {
    res.render('homepage.hbs', { name: req.user.name })
})

