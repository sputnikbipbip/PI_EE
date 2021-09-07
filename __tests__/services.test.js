'use strict'

const spoonacularData = require('../lib/spoonacular-data')
const services = require("../lib/trinkas-services")
const db = require('../lib/trinkas-db')
const fs = require('fs')

services.setDb();

//for tests
const groups = [{
    "recipes":[],
    "groupTitle":"Receitas Portuguesas",
    "description":"Sem amor","id":1,"calories":null},
    {"recipes": [
        {
            "rid":654959,
            "title":"Pasta With Tuna",
            "calories":
                {
                    "name":"Calories",
                    "title":"Calories",
                    "amount":420.82,
                    "unit":"kcal",
                    "percentOfDailyNeeds":21.04
                }
                },
            {
                "rid":511728,
                "title":"Pasta Margherita",
                "calories":{
                    "name":"Calories",
                    "title":"Calories",
                    "amount":809.41,
                    "unit":"kcal",
                    "percentOfDailyNeeds":40.47
                }
            }
            ],
        "groupTitle":"Mais receitas portuguesas",
        "description":"Com amor",
        "id":2,"calories":300
    },
    {"recipes":[
        {
            "rid":1095898,
            "title":"Meatballs with basil and roasted pepper sauce",
            "calories":
                {
                    "name":"Calories",
                    "title":"Calories",
                    "amount":510.59,
                    "unit":"kcal",
                    "percentOfDailyNeeds":25.53
                }
        }],
        "groupTitle":"Receitas para dormir logo a seguir",
        "description":"Roundy round",
        "id":3,
        "calories":300
    }]
const mostPopularRecipes = [
    {
    "title" : "Arroz doce",
    "calories" : "300",
    "carbs" : "delicioso"
    },
    {
    "title" : "Francesinha",
    "calories" : "3000",
    "carbs" : "suberbo"
    },
    {
        "title" : "Gelado de morango",
        "calories" : "500",
        "carbs" : "geladamente soberbo"
    }

]
const testRecipes = [
    {
        "title" : "Arroz doce",
        "calories" : "300",
        "carbs" : "delicioso"
    },
    {
        "title" : "Arroz salgado",
        "calories" : "350",
        "carbs" : "menos delicioso que o arroz doce"
    }
]

jest.mock('../lib/spoonacular-data');
jest.mock('../lib/trinkas-db');


//maintains a consistent dataset
afterEach((done)=>{
    let read = fs.readFileSync("data/groups.json");
    read = JSON.parse(read);
    fs.writeFileSync("__tests__/mocks/groups.json", JSON.stringify(read));
    done();
})


test('Get recipes ', done => {
    spoonacularData.getRecipes.mockImplementationOnce((name, cb) => {
         return cb(null, testRecipes)
    });
    services.getRecipes("Arroz", (err, recipes) => {
        expect(err).toBeFalsy()
        expect(recipes[0].title).toBe(testRecipes[0].title)
        expect(recipes[1].title).toBe(testRecipes[1].title)
        done()
    })
})

test('Get Most Popular Recipes ', done => {
    spoonacularData.getMostPopularRecipes.mockImplementationOnce((max, cb) => {
        cb(null, mostPopularRecipes)
    });
    services.getMostPopularRecipes(3, (err, recipes) => {
        expect(err).toBeFalsy()
        expect(mostPopularRecipes[0].title).toBe(mostPopularRecipes[0].title)
        expect(mostPopularRecipes[1].title).toBe(mostPopularRecipes[1].title)
        expect(mostPopularRecipes[1].title).toBe(mostPopularRecipes[1].title)
        done()
    })
})

test('Create Group', done => {
    db.createGroup.mockImplementationOnce((name,description, cb) => {
        cb(null, groups[0])
    });
    services.createGroup("Receitas Portuguesas","Com Amor" , (err, group) => {
        expect(err).toBeFalsy()
        expect(group.id).toBe(groups[0].id)
        expect(group.groupTitle).toBe(groups[0].groupTitle)
        done()
    })
})

test('Alter Group', done => {
    db.alterGroup.mockImplementationOnce((name,description, cb) => {
        cb(null, groups[0])
    });
    services.alterGroup("Receitas Portuguesas","Com Amor" , (err, group) => {
        expect(err).toBeFalsy()
        expect(group.id).toBe(groups[0].id)
        expect(group.groupTitle).toBe(groups[0].groupTitle)
        done()
    })
})

test('Delete Group', done => {
    db.deleteGroup.mockImplementationOnce((groupId, cb) => {
        cb(null)
    });
    services.deleteGroup(1 , (err, group) => {
        expect(err).toBeFalsy()
        done()
    })
})

test('Get all Groups', done => {
    db.getAllGroups.mockImplementationOnce((cb) => {cb(null, groups)});
    services.getAllGroups((err, g) => {
        expect(err).toBeFalsy()
        expect(g[0].title).toBe(groups[0].groupTitle)
        expect(g[1].title).toBe(groups[1].groupTitle)
        expect(g[2].title).toBe(groups[2].groupTitle)
        done()
    })
})


test('Add recipe to group', done => {
    db.addRecipeToGroup.mockImplementationOnce((groupId, recipe, cb) => {cb(null, groups[1])});
    spoonacularData.getRecipes.mockImplementationOnce((recipeName, cb) =>{
        cb(null, groups[1].recipes)
    })
    services.addRecipeToGroup(2, "Pasta With Tuna", (err, group) => {
        expect(err).toBeFalsy()
        expect(group.recipes.find(recipe => recipe.title == "Pasta With Tuna")).toBeTruthy()
        done()
    })
})

test('Remove recipe from group', done => {
    db.deleteRecipeFromGroup.mockImplementationOnce((groupId, recipe, cb) => {cb(null)});
    spoonacularData.getRecipes.mockImplementationOnce((recipeName, cb) =>{
        cb(null, testRecipes[0])
    })
    services.removeRecipeInGroup(2, "Pasta With Tuna", (err, group) => {
        expect(err).toBeFalsy()
        done()
    })
})

test('Get Recipe Group Within Range', done => {
    db.getRecipeGroupWithinRange.mockImplementationOnce((groupdId,  min, max, cb) => {cb(null, testRecipes)});
    services.GetRecipeGroupWithinRange(1,  1, 800, (err, recipes) => {
        expect(err).toBeFalsy()
        expect(recipes[0].title).toBe(testRecipes[0].title)
        expect(recipes[1].title).toBe(testRecipes[1].title)
        done()
    })
})



