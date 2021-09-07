let PORT = 8080;

const frisby = require('frisby');
const services = require("../lib/trinkas-services.js");
const routes = require("../lib/routes/trinkas-web-api");
const express = require('express');

const app = express();

let EXPECTED_RECIPES = [
    {
        "name" : "Arroz doce",
        "calorias" : "300",
        "descricao" : "delicioso"
    },
    {
        "name" : "Bacalhau a bras",
        "calorias" : "3500",
        "descricao" : "mega delicioso"
    }
]

let EXPECTED_GROUP = JSON.stringify({
    EXPECTED_RECIPES:  [
        {
            "name" : "Arroz doce",
            "calorias" : "300",
            "descricao" : "delicioso"
        },
        {
            "name" : "Bacalhau a bras",
            "calorias" : "3500",
            "descricao" : "mega delicioso"
        }
    ],
    groupTitle: "Receitas Portuguesas",
    description: "Com amor",
    id: 1
})

const ALTERED_EXPECTED_GROUP = JSON.stringify({
    EXPECTED_RECIPES:  [
        {
            "name" : "Arroz doce",
            "calorias" : "300",
            "descricao" : "delicioso"
        },
        {
            "name" : "Bacalhau a bras",
            "calorias" : "3500",
            "descricao" : "mega delicioso"
        }
    ],
    groupTitle: "Receitas Portuguesas",
    description: "Sem Amor",
    id: 1
})

let server;

beforeAll((done) =>{
    app.use('/api',routes.router);
    server = app.listen(PORT, ()=>{
        console.log("Listening on port 8080");
        done();
    })}
);

jest.mock('../lib/trinkas-services.js');

it('Get most popular recipes', () => {
    services.getMostPopularRecipes.mockImplementationOnce((limit, cb) =>{return cb(null, EXPECTED_RECIPES)});
    return frisby
        .get('http://localhost:8080/api/trinkas/recipes/mostpopular')
        .expect('status', 200)
        .expect('json', '[0]',EXPECTED_RECIPES[0])
        .expect('json', '[1]', EXPECTED_RECIPES[1])
});


it('Get recipe with name', () => {
    services.getRecipes.mockImplementationOnce((name, cb) =>{ return cb(null, EXPECTED_RECIPES[0]) })
    return frisby
        .get('http://localhost:8080/api/trinkas/recipes/complexSearch?name=Arroz')
        .expect('status', 200)
        .expect('json', 0 ,EXPECTED_RECIPES[0])
});



it('Create group of recipes', () => {
    services.createGroup.mockImplementationOnce((name, description, cb )=>{return cb(null,EXPECTED_GROUP)});
    return frisby
        .post('http://localhost:8080/api/trinkas/groups/createGroup', JSON.parse(EXPECTED_GROUP))
        .expect('status', 200)
        .expect('json', 0, EXPECTED_GROUP)
});


it('Alter group of recipes', () => {
    services.createGroup.mockImplementationOnce((name, description, cb )=>{return cb(null,EXPECTED_GROUP)});
    services.alterGroup.mockImplementationOnce((name, description, cb )=>{return cb(null,ALTERED_EXPECTED_GROUP)});
    frisby.post('http://localhost:8080/api/trinkas/groups/createGroup', JSON.parse(EXPECTED_GROUP))
    return frisby.post('http://localhost:8080/api/trinkas/groups/alterGroup', JSON.parse(ALTERED_EXPECTED_GROUP))
        .expect('status', 200)
        .expect('json', 0 ,ALTERED_EXPECTED_GROUP)
});

it('Delete group of recipes', () => {
    services.deleteGroup.mockImplementationOnce((groupdId, cb )=>{return cb(null)});
    return frisby.delete('http://localhost:8080/api/trinkas/groups/:groupId')
        .expect('status', 200)
});


afterAll(done => server.close(done));