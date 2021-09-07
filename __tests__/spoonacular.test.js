'use strict'

const spoonacularData = require('../lib/spoonacular-data')
const urlib = require('urllib')
const fs = require('fs')

jest.mock('urllib')

const testRecipe = {
    "title" : "Arroz de pato",
    "id" : 716429,
    "spoonacularScore" : 79,
    "nutrition" : {
        "nutrients": [{
            "name": "Calories",
            "title": "Calories",
            "amount": 584.46,
            "unit": "kcal",
            "percentOfDailyNeeds": 29.22
        },
        {
            "name": "Fat",
            "title": "Fat",
            "amount": 19.83,
            "unit": "g",
            "percentOfDailyNeeds": 30.51
        },
        {
            "name": "Saturated Fat",
            "title": "Saturated Fat",
            "amount": 8.09,
            "unit": "g",
            "percentOfDailyNeeds": 50.57
        },
        {
            "name": "Carbohydrates",
            "title": "Carbohydrates",
            "amount": 83.71,
            "unit": "g",
            "percentOfDailyNeeds": 27.9
        },
        {
            "name": "Net Carbohydrates",
            "title": "Net Carbohydrates",
            "amount": 76.98,
            "unit": "g",
            "percentOfDailyNeeds": 27.99
        },
        {
            "name": "Sugar",
            "title": "Sugar",
            "amount": 5.36,
            "unit": "g",
            "percentOfDailyNeeds": 5.95
        },
        {
            "name": "Cholesterol",
            "title": "Cholesterol",
            "amount": 31.02,
            "unit": "mg",
            "percentOfDailyNeeds": 10.34
        }]
    }
}



test('Get recipes ', done => {
    urlib.request.mockImplementationOnce((url, cb) => {
        fs.readFile('./__tests__/mocks/recipes.json', cb)
    })
    spoonacularData.getRecipes("Steak with lemon and capers", (err, recipes) => {
        expect(err).toBeFalsy()
        expect(recipes[0].title).toBe("Steak with lemon and capers")
        done()
    })
})



test('Get Most Popular Recipe', done => {
    urlib.request.mockImplementationOnce((url, cb) => {
        fs.readFile('./__tests__/mocks/recipes.json', cb)
    })
    spoonacularData.getMostPopularRecipes(2, (err, recipes) => {
        expect(err).toBeFalsy()
        expect(recipes.length == 2)
        expect(recipes[0].title).toBe("Steak with lemon and capers")
        done()
    })
})

