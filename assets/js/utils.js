// helper method for changing css and adding text for invalid inputs
function invalidateInput(input, warningText) {

    input.classList.add("is-danger");

    // warning text
    let p = document.createElement("p");
    p.className = "help is-danger";
    p.innerText = warningText;
    input.parentElement.parentElement.appendChild(p);

    // warning icon
    input.parentElement.classList.add("has-icons-right");
    let span = document.createElement("span");
    span.className = "icon is-small is-right";
    let i = document.createElement("i");
    i.className = "fas fa-exclamation-triangle";
    span.appendChild(i);

    input.parentElement.appendChild(span);

}

// remove invalidation
function clearInvalidation(input) {

    input.classList.remove("is-danger");
    if (input.type == "file") {
        input.parentElement.parentElement.classList.remove("is-danger");
    }

    let warningText = input.parentElement.parentElement.querySelector(".help.is-danger");
    if (warningText) { warningText.remove(); }

    let icon = input.parentElement.querySelector(".icon.is-small.is-right");
    if (icon) { icon.remove(); }

}
