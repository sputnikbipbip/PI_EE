'use strict'

const urllib = require('urllib')
const SPOONACULAR_HOST = 'https://api.spoonacular.com/recipes'
const SPOONACULAR_KEY = '79fc0d4617744b2588774ee43fc48c57'


//gets the N more popular recipes
function getMostPopularRecipes(numberOfRecipes = 20, cb){
    const GET_MOST_POPULAR_RECIPES = `${SPOONACULAR_HOST}/complexSearch?sort=meta-score&number=${numberOfRecipes}&addRecipeNutrition=true&format=json&apiKey=${SPOONACULAR_KEY}`
    urllib.request(GET_MOST_POPULAR_RECIPES, (err, buffer) =>{
        if(err) return cb(err);
        let recipes = JSON.parse(buffer)
        if(recipes) {
            const recipeObj = []
            recipes.results.forEach(recipe => recipeObj.push(addLinks(recipe)));
            cb(null, recipeObj)
        } else {
            let error = Error("Recipes not found");
            error.status = 404
            return cb(error)
        }
    })
}

function getRecipes(name, cb) {
    const GET_RECIPES = `${SPOONACULAR_HOST}/complexSearch?query=${name}&addRecipeNutrition=true&number=100&addRecipeInformation=true&format=json&apiKey=${SPOONACULAR_KEY}`
    urllib.request(GET_RECIPES, (err, buffer) =>{
        if(err) return cb(err);
        let recipes = JSON.parse(buffer)
        if(recipes.results) {
            return cb(null, recipes.results)
        } else {
            let error = Error("Recipes not found");
            error.status = 404;
            return cb(error)
        }
    })
}

/**
 * returns a recipe with its full creation process
 * @param Id
 * @param cb
 */
function getRecipeById(Id, cb) {
    const GET_RECIPE = `${SPOONACULAR_HOST}/${Id}/information?includeNutrition=true&format=json&apiKey=${SPOONACULAR_KEY}`
    urllib.request(GET_RECIPE, ((err, buffer) => {
        if(err) return cb(err);
        let recipe = JSON.parse(buffer)
        if(recipe) {
            return cb(null, recipe)
        } else {
            let error = Error("Recipe not found");
            error.status = 404
            return cb(error)
        }
    }))
}

function addLinks(recipe){
    return {
        title: recipe.title,
        details:`http://localhost:8000/trinkas/recipes/${recipe.id}`
    }
}


module.exports = {
    getMostPopularRecipes,
    getRecipes,
    getRecipeById
}