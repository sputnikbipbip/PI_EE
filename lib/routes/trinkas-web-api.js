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
const PATH_GROUP_RECIPE = PATH_GROUPS + '/:id' + '/recipes/:recipeName';
const PATH_GROUP_RECIPE_MIN_MAX = PATH_GROUP + '/recipes?min=?&max=?';


const Router = require('express').Router
const router = Router()

module.exports = {
    router,
    setDb
}
//TODO: put const variable instead of full on string path

//GET + /trinkas/recipes/mostpopular
router.get(PATH_RECIPES_MOST_POPULAR, popularRecipesHandler);

//GET + /trinkas/recipes/complexSearch?query=Arroz
router.get(PATH_RECIPES_SEARCH,  getRecipesWithNameHandler);

//GET + /trinkas/recipes/:id
router.get(PATH_RECIPE, recipeDetailsHandler);

//POST + /trinkas/recipes/createGroup
router.post(PATH_GROUPS_CREATE, createGroupHandler);

//PUT + /trinkas/recipes/createGroup
router.post(PATH_GROUPS_ALTER,  alterGroupHandler);

//DELETE trinkas/groups/{id}
router.delete(PATH_GROUP, deleteGroupHandler);

//List all groups
router.get(PATH_GROUPS,  listAllGroupHandler);

//display group info
router.get(PATH_GROUP,   getGroupHandler);

//add recipe to group
router.post(PATH_GROUP_RECIPE,   addRecipeToGroupHandler);

//delete recipe from group
router.delete(PATH_GROUP_RECIPE,   removeRecipeInGroupHandler);

//get recipe with min max
router.delete(PATH_GROUP_RECIPE_MIN_MAX,  GetRecipeGroupWithinRange);

function setDb(isElasticSearch){
    trinkasServices.setDb(isElasticSearch);
}


function getRecipesWithNameHandler(req, rsp, next){
    let name = req.query.name;
    trinkasServices.getRecipes(name, (err, recipes) =>{
        if(err)return next(err);
        if(!recipes){
            const error = new Error("There is no such recipe")
            error.status = 404;
            return next(error);
        }
        console.log(recipes);
        rsp.json(recipes);
    });
}

function popularRecipesHandler(req, rsp, next){
    const limit = req.query.limit;
    trinkasServices.getMostPopularRecipes(limit , (err, recipes) =>{
        if(err)return next(err);
        if(!recipes){
            const error = new Error("There are no recipes")
            error.status = 404;
            return next(error);
        }
        rsp.json(recipes);
    });

}
function recipeDetailsHandler(req, rsp, next){
    let id = req.params.id;
    //TODO:if no Id throw error
    trinkasServices.getRecipeById(id, (err, recipe) =>{
        if(err)return next(err);
        if(!recipe){
            const error = new Error("There is no such recipe")
            error.status = 404;
            return next(error);
        }
        rsp.json(recipe);
    });
}

function createGroupHandler(req, rsp, next){
    let name = req.query.name;
    let description = req.query.description;
    trinkasServices.createGroup(name, description, (err, group) =>{
        if(err)return next(err);
        if(!group){
            const error = new Error("There is no group with that name")
            error.status = 404;
            return next(error);
        }
        rsp.json(group);
    });

}

function alterGroupHandler(req, res, next){
    let name = req.query.name;
    let description = req.query.description;
    trinkasServices.alterGroup(name, description, (err, group)=>{
        if(err)return next(err);
        if(!group){
            const error = new Error("There is no group with that name")
            error.status = 404;
            return next(error);
        }
        res.json(group);
    });
}

function deleteGroupHandler(req, res, next) {
    let groupId = req.query.groupId;
    trinkasServices.deleteGroup(groupId, (err) =>{
        if(err) return next(err)
        res.json("Deleted")
    })
}

function listAllGroupHandler(req, res, next) {
    trinkasServices.getAllGroups((err, groups) =>{
        if(err) return next(err);
        if(!groups){
            const error = new Error("There are no groups yet")
            error.status = 404;
            return next(error);
        }
        res.json(groups);
    })
}


function getGroupHandler(req, res, next) {
    const groupdId = req.query.groupId;
    trinkasServices.getGroup(groupdId, (err, group) =>{
        if(err) return next(err);
        if(!group){
            const error = new Error("No such group found")
            error.status = 404;
            return next(error);
        }
        res.json(group);
    })
}

function addRecipeToGroupHandler(req, res, next) {
    const groupdId = req.query.groupId;
    const recipeName = req.query.recipeName;
    trinkasServices.addRecipeToGroup(groupdId, recipeName, (err, group) =>{
        if(err) return next(err);
        if(!group){
            const error = new Error("No such group found")
            error.status = 404;
            return next(error);
        }
        res.json(group);
    })
}

function removeRecipeInGroupHandler(req, rs, next){
    const groupdId = req.query.groupId;
    const recipeName = req.query.recipeName;
    trinkasServices.removeRecipeInGroup(groupdId, recipeName, (err) =>{
        if(err) return next(err);
    })
}

function GetRecipeGroupWithinRange(req, res, next){
    const groupdId = req.query.groupId;
    const recipeName = req.query.recipeName;
    trinkasServices.GetRecipeGroupWithinRange(groupdId, recipeName, min, max, (err, recipes) =>{
        if(err) return next(err);
        if(!recipes){
            const error = new Error("No such recipe found")
            error.status = 404;
            return next(error);
        }
        res.json(recipes);
    })
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/trinkas/login')
}
