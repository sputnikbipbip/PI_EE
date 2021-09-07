'use strict'

const db = require('./../lib/trinkas-db')
const services = require("../lib/trinkas-services");
const express = require('express');
const routes = require("../lib/routes/trinkas-web-auth");
const app = express();

let PORT = 8080;

let server;

services.setDb();

const users = [
    {
        "id":"324124324123",
        "name":"Zé Fernando",
        "email":"aquiharato@hotmail.com",
        "password":"atireiopauaogato"
    },
    {
        "id":"232432432432",
        "name":"Albertina Dias",
        "email":"docedepessoa@hotmail.com",
        "password":"paisdasmaravilhas"
    }
]



beforeAll((done) =>{
    app.use(routes);
    server = app.listen(PORT, ()=>{
        console.log("Listening on port 8080");
        done();
    })}
);

jest.mock('../lib/trinkas-db');

test('Test users module getUserByEmail', () => {
    db.getUserByEmail.mockReturnValue(users[0])

    services.getUserByEmail('aquiharato@hotmail.com', (err, user)=>{
        expect(user.name).toBe('Zé Fernando')
    })

})



afterAll(done => server.close(done));