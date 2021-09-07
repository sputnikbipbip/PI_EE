if (window.addEventListener) // W3C standard
{
    window.addEventListener('load', setup, false);
}
else if (window.attachEvent) // Microsoft
{
    window.attachEvent('onload', setup);
}

function setup() {
    console.log("setting up delete recipe");
    const groupId = document.querySelector(".groupId").textContent;
    document
        .querySelectorAll('.recipeItem')
        .forEach(item => {
            const recipeName = item.querySelector(".recipeName").textContent
            item
                .querySelector("button")
                .addEventListener("click", () => handlerRemoveRecipe(item, recipeName, groupId))
        });
}

/**
 * @param {Element} item
 */
function  handlerRemoveRecipe(item, recipeName,groupId) {
    alert('are you sure you want to delete');
    const path =  '/trinkas/groups/' + groupId + '/recipes/' + recipeName;
    fetch(path, { method: 'DELETE' })
        .then(resp => {
            if(resp.status != 200) alertMsg(resp.statusText)
            else {
                alertMsg(recipeName + ' successfully removed.', 'success')
                item.remove()
            }
        })
        .catch(err => alertMsg(err))
}

/**
 * @param {String} message
 * @param {(success|danger)} kind It is danger by default
 */
function alertMsg(message, kind){
    if(!kind) kind = 'danger'
    document
        .querySelector('.messages')
        .innerHTML =
        `<div class="alert alert-${kind} alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
         </button>
        ${message}
        </div>`
}