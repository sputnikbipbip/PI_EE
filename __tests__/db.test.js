'use strict'
const fs = require('fs')
const db = require('../lib/trinkas-db').init('./__tests__/mocks/groups.json')

let groups = [{
    "recipes":[],
    "groupTitle":"Receitas Portuguesas",
    "description":"Sem amor",
    "id":1,
    "calories":null
    },
    {
    "recipes":[
        {"rid":654959,"title":"Pasta With Tuna",
            "calories":{"name":"Calories","title":"Calories","amount":420.82,"unit":"kcal","percentOfDailyNeeds":21.04}},
        {"rid":511728,"title":"Pasta Margherita",
            "calories":{"name":"Calories","title":"Calories","amount":809.41,"unit":"kcal","percentOfDailyNeeds":40.47}}],
    "groupTitle":"Mais receitas portuguesas",
    "description":"Com amor",
    "id":2,
    "calories":300},
    {
    "recipes":[
    {"rid":1095898,"title":"Meatballs with basil and roasted pepper sauce",
        "calories":{"name":"Calories","title":"Calories","amount":510.59,"unit":"kcal","percentOfDailyNeeds":25.53}}],
    "groupTitle":"Receitas para dormir logo a seguir",
    "description":"Roundy round",
    "id":3,
    "calories":300
    }]


let groups_after_deletion = [
    {
        "recipes":  [
            {
                "title" : "Massa Italiana",
                "calories" : 300,
                "summary" : "delicioso",
                "score" : 250
            },
            {
                "title" : "Bacalhau a bras",
                "calories" : 3500,
                "summary" : "mega delicioso",
                "score" : 698
            }
        ],
        "groupTitle": "Mais receitas portuguesas",
        "description": "Com amor",
        "id": 2,
        "calories": 300
    },
    {
        "recipes":  [
            {
                "title" : "Spicy meatballs",
                "calories" : 300,
                "summary" : "Spiciest meatballs of them all",
                "score" : 100
            }
        ],
        "groupTitle": "Receitas para dormir logo a seguir",
        "description": "Roundy round",
        "id": 3,
        "calories": 300
    }]




afterEach((done)=>{
        let read = fs.readFileSync("data/groups.json");
        read = JSON.parse(read);
        fs.writeFileSync("__tests__/mocks/groups.json", JSON.stringify(read));
        done();
})

test('Alter group', (done) => {
    db.alterGroup( 1, "Receitas Portuguesas","Sem Amor",(err, group) => {
        expect(err).toBeFalsy()
        expect(group.name).toBe("Receitas Portuguesas")
        expect(group.description).toBe("Sem Amor")
        done()
    })
})

test('Delete group', (done) => {
    db.deleteGroup( 1, (err, groups) => {
        expect(err).toBeFalsy()
        let idx = 0;
        groups.forEach(group =>{
            expect(group.id).toBe(groups_after_deletion[idx].id)
            idx++;
        })
        done()
    })
})

test('Create group', (done) => {
    db.createGroup( "Manjar", "Comida para familias", (err, group) => {
        expect(err).toBeFalsy()
        expect(group.id).toBe(4)
        done()
    })
})

test('List all groups', (done) => {
    db.getAllGroups( (err, g) => {
        expect(err).toBeFalsy()
        let idx = 0;
        g.forEach(group =>{
            expect(group.id).toBe(groups[idx++].id)
        });
        done()
    })
})

test('Add recipe to group', (done) => {
    let recipe = {
        "rid":1095898,
        "title":"Meatballs with basil and roasted pepper sauce",
        "calories":{"name":"Calories","title":"Calories","amount":510.59,"unit":"kcal","percentOfDailyNeeds":25.53}
    }

    db.addRecipeToGroup( 1, recipe, (err, groups) => {
        expect(err).toBeFalsy()
        expect(groups[0].recipes[0].name).toBe(recipe.name)
        expect(groups[0].recipes[0].description).toBe(recipe.description)
        expect(groups[0].recipes[0].calories).toBe(recipe.calories)
        done()
    })
})


test('Remove recipe from group', (done) => {
    let recipe = {
        "rid":654959,
        "title":"Pasta With Tuna",
        "calories":{"name":"Calories","title":"Calories","amount":420.82,"unit":"kcal","percentOfDailyNeeds":21.04}
    }
    db.deleteRecipeFromGroup( 2, recipe, (err, groups) => {
        expect(err).toBeFalsy()
        expect(groups[1].recipes.find(r => r.title == recipe.title)).toBeFalsy()
        done()
    })
})


test('Get recipes withing range', (done) => {
    let recipe = {
        "rid":654959,
        "title":"Pasta With Tuna",
        "calories":{"name":"Calories","title":"Calories","amount":420.82,"unit":"kcal","percentOfDailyNeeds":21.04}
    }

    db.getRecipeGroupWithinRange( 2,2 , 800, (err, recipes) => {
        expect(err).toBeFalsy()
        expect(recipes.length).toBe(1);
        expect(recipes[0].title).toBe(recipe.title)
        done()
    })
})








