if (window.addEventListener) // W3C standard
{
    window.addEventListener('load', setup, false);
}
else if (window.attachEvent) // Microsoft
{
    window.attachEvent('onload', setup);
}

function setup() {
    console.log("setting up delete group");
    const row = document.getElementById("group")
    const groupName = document.querySelector(".name");
    document
        .querySelectorAll("tr")
        .forEach(item =>{
            const groupId = item.querySelector(".groupId").textContent;
            item.querySelector("button")
                .addEventListener("click", () => handlerRemoveRecipe(row, groupName, groupId))
        })
};


/**
 * @param {Element} item
 */
function  handlerRemoveRecipe(row, groupName,groupId) {
    alert('are you sure you want to delete');
    const path =  '/trinkas/groups/' + groupId;
    fetch(path, { method: 'DELETE' })
        .then(resp => {
            if(resp.status != 200) alertMsg(resp.statusText)
            else {
                alertMsg(groupName + ' successfully removed.', 'success')
                row.remove()
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