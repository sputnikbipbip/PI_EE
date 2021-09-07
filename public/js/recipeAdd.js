if (window.addEventListener) // W3C standard
{
    window.addEventListener('load', setup, false);
}
else if (window.attachEvent) // Microsoft
{
    window.attachEvent('onload', setup);
}

function setup() {
    console.log("setting up adding recipe to group");
    const form = document.getElementById("addRecipeToGroup");
    const selectElement = form.elements['groupId'];
    const recipeName = document.getElementById("recipeName").textContent;
    form
        .addEventListener('submit', () => {console.log("reached listener"), handlerAddRecipe(recipeName, selectElement)});
}

/**
 * @param {Element} item
 */
function  handlerAddRecipe(recipeName,selectElement) {
    console.log('are you sure you want to add');
    const groupId = selectElement.value;
    const path =  '/trinkas/groups/' + groupId + '/recipes/' + recipeName;
    fetch(path, { method: 'POST' })
        .then(resp => {
            if(resp.status != 200) alertMsg(resp.statusText)
            else {
                alertMsg(recipeName + ' successfully added.', 'success')
            }
        })
        .catch(err => alertMsg(err))
}