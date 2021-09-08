'use strict'

const trinkasServices = require("../trinkas-services")
const PATH_TRINKAS = '/trinkas';
const PATH_RECIPES = PATH_TRINKAS +'/recipes';
const PATH_RECIPE = PATH_RECIPES + '/:id';
const PATH_RECIPES_SEARCH = PATH_RECIPES + '/complexSearch';
const PATH_RECIPES_MOST_POPULAR = PATH_RECIPES + '/mostpopular';
const PATH_GROUPS = PATH_TRINKAS + '/groups';
const PATH_GROUPS_CREATE = PATH_GROUPS + '/createGroup';
const PATH_GROUPS_ALTER = PATH_GROUPS + '/alterGroup';
const PATH_GROUP = PATH_GROUPS + '/:id';
const PATH_GROUP_RECIPE = PATH_GROUPS + '/:id/recipes/:recipeName';
const PATH_GROUP_RECIPE_MIN_MAX = PATH_GROUP + '/recipes?min=?&max=?';

const Router = require('express').Router
const router = Router()

module.exports = {
    router,
    setDb
}

//GET + /trinkas
router.get('/trinkas', checkAuthenticated, rootHandler);

//GET + /trinkas/recipes/mostpopular
router.get(PATH_RECIPES_MOST_POPULAR, checkAuthenticated, popularRecipesHandler);

//GET + /trinkas/recipes/complexSearch?query=Arroz
router.get(PATH_RECIPES_SEARCH, checkAuthenticated, getRecipesWithNameHandler);

//GET + /trinkas/recipes/{id}
router.get(PATH_RECIPE, checkAuthenticated, recipeDetailsHandler);

//POST + /trinkas/recipes/createGroup
router.post(PATH_GROUPS_CREATE, checkAuthenticated, createGroupHandler);

//PUT + /trinkas/recipes/createGroup
router.put(PATH_GROUPS_ALTER, checkAuthenticated, alterGroupHandler);

//DELETE + /trinkas/groups/{id}
router.delete(PATH_GROUP, checkAuthenticated, deleteGroupHandler);

//GET + trinkas/groups 
router.get(PATH_GROUPS, checkAuthenticated, listAllGroupHandler);

//GET + trinkas/groups/{id}
router.get(PATH_GROUP, checkAuthenticated, getGroupHandler);

//POST + /trinkas/groups/{id}/recipes/{recipeName} 
router.post(PATH_GROUP_RECIPE, checkAuthenticated, addRecipeToGroupHandler);

//DELETE + /trinkas/groups/{id}/recipes/{recipeName}
router.delete(PATH_GROUP_RECIPE, checkAuthenticated, removeRecipeInGroupHandler);

//GET + trinkas/groups/{id}/recipes?min=?&max=?
router.get(PATH_GROUP_RECIPE_MIN_MAX, checkAuthenticated, GetRecipeGroupWithinRange);


function setDb(isElasticSearch){
    trinkasServices.setDb(isElasticSearch);
}

function rootHandler(req, rsp, next) {
    if(req.isAuthenticated()){
        rsp.render('homePage');
    }
    else{
        rsp.redirect("/login");
    }

}

function getRecipesWithNameHandler(req, rsp, next){
    let name = req.query.name;
    if(!name){
        const error = new Error("Invalid argument")
        error.status = 400;
        return next(error);
    }
    trinkasServices.getRecipes(name, (err, recipes) =>{
        if(err)return next(err);
        const recipeArr = []
        recipes.forEach(recipe => recipeArr.push(addLinks(recipe)));
        const recipeObj = {recipes:recipeArr};
        rsp.render('recipes', recipeObj);
    });
}

function recipeDetailsHandler(req, rsp, next){
    let id = req.params.id;
    trinkasServices.getRecipeById(id, (err, recipe) =>{
        if(err)return next(err);
        rsp.render('recipeDetails', recipe);
    });
}

function popularRecipesHandler(req, rsp, next){
    const limit = req.query.limit;
    trinkasServices.getMostPopularRecipes(limit , (err, recipes) =>{
        if(err)return next(err);
        const recipeObj = {recipes:recipes};
        rsp.render('recipes', recipeObj);
    });
}

function createGroupHandler(req, rsp, next){
    let name = req.body.groupName;
    let description = req.body.description;
    const email = req.user.email;
    const password = req.user.password;
    trinkasServices.createGroup(email, password,name, description, (err, group) =>{
        if(err)return next(err);
        rsp.redirect('/trinkas/groups')
    });
}

function alterGroupHandler(req, res, next){
    let name = req.query.name;
    let description = req.query.description;
    trinkasServices.alterGroup(name, description, (err, group)=>{
        if(err)return next(err);
        res.redirect('/trinkas/groups')
    });
}

function deleteGroupHandler(req, res, next) {
    let groupId = req.params.id;
    trinkasServices.deleteGroup(groupId, (err) =>{
        if(err) return next(err)
        res.redirect('/trinkas/groups')
    })
}

function listAllGroupHandler(req, res, next) {
    trinkasServices.getAllGroups((err, groups) =>{
        if(err) return next(err);
        const email = req.user.email;
        const password = req.user.password;
        const reducedGroups = groups.filter(group  => {
           return group.owner.email == email && group.owner.password == password
        });
        const groupsArr = [];
        reducedGroups.forEach(group => groupsArr.push(addLinksGroups(group)));
        const groupObj = {groups:groupsArr};
        res.render('groups', groupObj);
    })
}


function getGroupHandler(req, res, next) {
    const id = req.params.id;
    trinkasServices.getGroup(id, (err, group) =>{
        if(err)return next(err);
        const groupRecipeObj = []
        group.recipes.forEach(recipe => groupRecipeObj.push(addLinks(recipe)));
        group.recipes = groupRecipeObj;
        res.render('groupDetails', group);
    })
}

function addRecipeToGroupHandler(req, res, next) {
    const groupdId = req.body.groupId;
    const recipeName = req.body.recipeName;
    trinkasServices.addRecipeToGroup(groupdId, recipeName, (err, group) =>{
        if(err) return next(err);
        res.render('groupDetails', group);
    })
}

function removeRecipeInGroupHandler(req, res, next){
    const groupdId = req.params.id;
    const recipeName = req.params.recipeName;
    trinkasServices.removeRecipeInGroup(groupdId, recipeName, (err) =>{
        if(err) return next(err);
        res.redirect('/trinkas/groups/' + groupdId);
    })
}

function GetRecipeGroupWithinRange(req, res, next){
    const groupdId = req.query.groupId;
    const recipeName = req.query.recipeName;
    trinkasServices.GetRecipeGroupWithinRange(groupdId, recipeName, min, max, (err, recipes) =>{
        if(err) return next(err);
        res.redirect('/trinkas/groups/' + groupdId);
    })
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/trinkas/login')
}

//adds links to each separate group in the group listing page
function addLinksGroups(group){
    return {
        title: group.groupTitle,
        id : group.id,
        details:`http://localhost:8000/trinkas/groups/${group.id}`
    }
}
//adds recipe links to each recipe when a group of recipes is listed
function addLinks(recipe){
    return {
        title: recipe.title,
        details:`http://localhost:8000/trinkas/recipes/${recipe.id}`
    }
}
