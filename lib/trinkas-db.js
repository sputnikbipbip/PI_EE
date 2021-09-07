'use strict'

const fs = require('fs')

let groupsPath = './data/groups.json'
let usersPath = './data/users.json'

function addUser(name, email, password, cb) {
    fs.readFile(usersPath, (err, buffer) =>{
        let users = JSON.parse(buffer);
        let checkUserEmail = null;
        checkUserEmail = users.find(user => user.email === email);
        if(!checkUserEmail){
            let user = {
                id : Date.now().toString(),
                name: name,
                email: email,
                password: password
            }
            users.push(user)
            fs.writeFile(usersPath,JSON.stringify(users), (err) =>{
                if(err)return cb(err)
                return cb(null, user)
            })
        }
        else{
            const err = Error("User email already in use");
            err.status = 409;
            cb(err);
        }
    })
}

function getUserByEmail(email, cb) {
    fs.readFile(usersPath, (err, buffer)=>{
        const users = JSON.parse(buffer)
        const user = users.find(user => user.email == email)
        if(user) {
            cb(null, user)
        } else {
            let err = Error('User not found');
            err.status = 404;
            cb(err);
        }
    });
}

function getUserById(id, cb) {
    fs.readFile(usersPath, (err, buffer)=>{
        const users = JSON.parse(buffer)
        const user = users.find(user => user.id == id)
        if(user) {
            cb(null, user)
        } else {
            let err = Error('User not found');
            err.status = 404;
            cb(err);
        }
    });
}

function deleteUser(userID, cb) {
    fs.readFile(groupsPath, (err, buffer)=>{
        let users = JSON.parse(buffer);
        const removeUser = users.find(user => user.id == userID);
        if(removeUser) {
            users = users.filter((g) => {
                return g.id !== removeUser.id;
            });
            fs.writeFile(usersPath,JSON.stringify(users), (err) =>{
                if(err)return cb(err);
                return cb(null, users);
            })

        } else {
            const err = Error('User not found');
            err.status = 404;
            return cb(err);
        }
    });
}


function createGroup(email, password, name, description, cb){
    let id;
    getLastID((err, idx) =>{
        if (err) return cb(err)
        id = idx + 1;
    });
    fs.readFile(groupsPath, (err, buffer) =>{
        let groups = JSON.parse(buffer);
        let group = {
            owner:{
                email:email,
                password:password
            },
            recipes:  [],
            groupTitle: name,
            description: description,
            id: id
        };
        groups.push(group);
        fs.writeFile(groupsPath,JSON.stringify(groups), (err) =>{
            if(err)return cb(err);
            return cb(null, group);
        });
    });
};




function alterGroup(groupID, groupName, groupDescription, cb){
    fs.readFile(groupsPath, (err, buffer)=>{
        const groups = JSON.parse(buffer)
        const group = groups.find(group => group.id == groupID)
        if(group) {
            group.name = groupName
            group.description = groupDescription
            cb(null, group)
        } else {
            const err = Error('Group not found');
            err.status = 404;
            return cb(err);
        }
    });

}

function deleteGroup(groupID, cb) {
    fs.readFile(groupsPath, (err, buffer)=>{
        let groups = JSON.parse(buffer);
        const removeGroup = groups.find(group => group.id == groupID)
        if(removeGroup) {
            groups = groups.filter((g) => {
                return g.id !== removeGroup.id
            });
            fs.writeFile(groupsPath,JSON.stringify(groups), (err) =>{
                if(err)return cb(err)
                return cb(null, groups)
            })
        } else {
            const err = Error('Group not found');
            err.status = 404;
            return cb(err);
        }
    });
}

function getGroup(id, cb) {
    fs.readFile(groupsPath, (err, buffer)=>{
        const groups = JSON.parse(buffer)
        if(groups) {
            const groupObj = groups.find(group => group.id == id);
            return cb(null, groupObj)
        } else {
            let err = Error('Resource not found');
            err.status = 404;
            return cb(err);
        }
    });
}


function getAllGroups(cb) {
    fs.readFile(groupsPath, (err, buffer)=>{
        if(err) return cb(err);
        const groups = JSON.parse(buffer);
        if(groups) {
            return cb(null, groups);
        } else {
            let err = Error('Resource not found');
            err.status = 404;
            return cb(err);
        }
    });
}


function deleteRecipeFromGroup(groupID, recipe, cb) {
    fs.readFile(groupsPath, (err, buffer) =>{
        let groups = JSON.parse(buffer);
        const group = groups.find(group => group.id == groupID);
        if(group){
            const index = group.recipes.findIndex(r => r.name == recipe.name);
            if(index >= 0){
                group.calories -= group.recipes[index].calories
                group.recipes.splice(index, 1);
                fs.writeFile(groupsPath, JSON.stringify(groups),(err) =>{
                    if(err) return cb(err)
                    return cb(null, groups);
                } )
            }else{
                let err = Error('Recipe not found');
                err.status = 404;
                return cb(err);
            }
        }else{
            let err = Error('Group not found');
            err.status = 404;
            return cb(err);
        }
    });
}


function addRecipeToGroup(groupId, recipe, cb) {
    fs.readFile(groupsPath, (err, buffer) =>{
        let groups = JSON.parse(buffer);
        let group = groups.find(group => group.id == groupId);
        let tempGroup = group;
        if(group){
            let recipeToAdd = group.recipes.find(r => r.name == recipe.name)
            if(recipeToAdd){
                const err = Error("User email already in use");
                err.status = 409;
                return cb(err);
            }
            group.recipes.push(recipe)
            group.calories += group.recipes.calories
            let idx = groups.indexOf(tempGroup);
            groups[idx] = group;
            fs.writeFile(groupsPath,JSON.stringify(groups), (err) =>{
                if(err)return cb(err)
                return cb(null, groups)
            })
        }
        else{
            let err = Error('Group not found');
            err.status = 404;
            return cb(err);
        }
    })
}

function getRecipeGroupWithinRange(groupID, min = 0, max = 800, cb) {
    fs.readFile(groupsPath, (err, buffer) =>{
        if(err) return cb(err);
        let groups = JSON.parse(buffer);
        const group = groups.find(group => group.id == groupID)
        if(group){
            let filteredRecipes = group.recipes.filter(recipe => recipe.calories.amount >= min && recipe.calories.amount <= max)
            return cb(null, filteredRecipes);
        }else{
            const error = Error("No such group");
            error.status = 404;
            return cb(error);
        }
    })
}

function init(path) {
    if(path) groupsPath = path
    return API
}

//helper function used to get the last id of the last group
function getLastID(cb) {
    fs.readFile(groupsPath, (err, buffer) =>{
        if (err) return cb(err);
        let groups = JSON.parse(buffer);
        if(groups.length === 0) return cb(null, 0)
        groups = groups.reduce(function(prev, current) {
            return (prev.id > current.id) ? prev : current  });
        return cb(null, groups.id);
    });
}


const API = {
    createGroup,
    alterGroup,
    addRecipeToGroup,
    deleteGroup,
    init,
    deleteRecipeFromGroup,
    getRecipeGroupWithinRange,
    getAllGroups,
    addUser,
    getGroup,
    getUserByEmail,
    getUserById
}

module.exports = API;

