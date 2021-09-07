'use strict'

const spoontacularData = require("./spoonacular-data")


//elastic search setup
const es = {
    host: 'localhost',
    port: '9200',
    urlGroups: 'groups',
    urlUsers: 'users'
}

let trinkasDb;
function setDb(isElasticSearch = false){
    if(!isElasticSearch){
        trinkasDb = require("./trinkas-db")
    }else{
        trinkasDb = require("./elasticsearch-db")
        trinkasDb = trinkasDb.init(es)
    }
}

//___________USERS______________________________________//

function addUser(name, email, password, cb) {
    trinkasDb.addUser(name, email, password, (err, users) => {
        if(err)return cb(err);
        return cb(null, users);
    });
}

function getUserByEmail(email, cb) {
    trinkasDb.getUserByEmail(email, (err, user) => {
        if(err)return cb(err);
        return cb(null, user);
    });
}

function getUserById(id, cb) {
    trinkasDb.getUserById(id, (err, user) => {
        if(err)return null;
        return cb(null, user);
    });
}



//__________RECIPES_________________________________________//
function getMostPopularRecipes(limit, cb) {
   spoontacularData.getMostPopularRecipes(limit, (err, recipes) =>{
       if(err) return cb(err);
       return cb(null, recipes);
   });
}
function getRecipes(name, cb) {
    spoontacularData.getRecipes(name, (err, recipes) =>{
        if(err)return cb(err);
        return cb(null, recipes);
    });
}

function getRecipeById(id, cb) {
    spoontacularData.getRecipeById(id, (err, recipe) =>{
        if(err) return cb(err);
        const recipeObj = shapeRecipe(recipe)
        return cb(null, recipeObj);
    });
}


//------------GROUPS---------------//

function createGroup(email, password, name, description, cb) {
    trinkasDb.createGroup(email, password, name, description, (err, group) => {
        if(err)return cb(err);
        return cb(null, group);
    });
}

function alterGroup(name, description, cb) {
    trinkasDb.alterGroup(name, description, (err, group) =>{
        if(err)return cb(err);
        return cb(null, group);
    });
}

function deleteGroup(groupId, cb) {
    trinkasDb.deleteGroup(groupId, (err) =>{
        if(err) cb(err)
        cb(null)
    });
}


function getGroup(id, cb) {
    trinkasDb.getGroup(id,(err, group)=>{
        if(err)return cb(err);
        return cb(null, group);
})
}


function getAllGroups(cb) {
    trinkasDb.getAllGroups((err, groups)=>{
        if(err)return cb(err);
        return cb(null, groups);
    })
}

function addRecipeToGroup(groupId, recipeName, cb) {
    spoontacularData.getRecipes(recipeName, (err, recipe) =>{
        if(err)return cb(err);
        trinkasDb.addRecipeToGroup(groupId, recipe, (err, group) =>{
            if(err)return cb(err);
            return cb(null, group);
        })
    })
}

function removeRecipeInGroup(groupdId, recipeName, cb) {
    spoontacularData.getRecipes(recipeName, (err, recipe) =>{
        if(err)return cb(err)
        trinkasDb.deleteRecipeFromGroup(groupdId, recipe, (err)=>{
            if(err)return cb(err);
            return cb(null);
        })
    });
}


function GetRecipeGroupWithinRange(groupdId, min, max, cb) {
    trinkasDb.getRecipeGroupWithinRange(groupdId,  min, max, (err, recipes) => {
        if (err) return cb(err);
        return cb(null, recipes);
    })
}


//takes the whole recipe and extracts the properties we want
function shapeRecipe(recipe) {
    let calories;
    if(recipe.nutrition)calories = recipe.nutrition.nutrients.find(n => n.name == 'Calories');
    else calories = -1;
    return  {   rid: recipe.id,
        title: recipe.title,
        pricePerServing: recipe.pricePerServing,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        calories: calories,
        healthScore: recipe.healthScore,
        steps: recipe.analyzedInstructions,
        image: recipe.image
    }
}


module.exports = {
    getMostPopularRecipes,
    createGroup,
    alterGroup,
    deleteGroup,
    getAllGroups,
    getRecipes,
    addRecipeToGroup,
    removeRecipeInGroup,
    GetRecipeGroupWithinRange,
    getRecipeById,
    setDb,
    addUser,
    getGroup,
    getUserByEmail,
    getUserById
}