const { createClient } = supabase,
      _supabase = createClient('https://apdqcjlnovlnwziquaye.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZHFjamxub3Zsbnd6aXF1YXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ1Njg5NDAsImV4cCI6MTk4MDE0NDk0MH0.qESxhTdMvDRuGyNhC9C65S3Syq4iSIGMh5KEjTBG6K0');

var items = [];

// Prevent form from submitting when the Enter key is pressed
document.getElementById("add-item-form").addEventListener("submit", (event) => {
    event.preventDefault();
});
document.getElementById("add-project-form").addEventListener("submit", (event) => {
    event.preventDefault();
});

// event listeners to switch tabs
const tabList = document.querySelector("#tab-bar ul");
tabList.querySelectorAll("#tab-bar li").forEach(elem => {
    elem.addEventListener("click", e => {
        tabList.querySelectorAll("li").forEach(tab => {
            tab.classList.remove("is-active");
        })

        e.currentTarget.classList.add("is-active")
    })
});

window.onload = async () => {
    // Fetch server data on page load
    await updateTableFromServer()

    // Context menu logic
    for (const row of document.getElementsByClassName("inventory-list-row")) {
        row.addEventListener("contextmenu", (event) => {
            event.preventDefault();

            let contextMenu = document.getElementById("context-menu");

            // remove selection on old row
            if (contextMenu.selected) {
                document.getElementById("inventory-data").children[contextMenu.selected - 1].classList.remove("is-selected");
            }

            event.target.parentElement.classList.add("is-selected");
            contextMenu.selected = event.target.parentElement.rowIndex;

            contextMenu.dataset.id = row.dataset.id;
            contextMenu.classList.remove("is-hidden");
            contextMenu.style.left = event.pageX + "px";
            contextMenu.style.top = event.pageY + "px";
        }, false)
    };

    window.addEventListener("click", (event) => {
        let contextMenu = document.getElementById("context-menu");
        
        if (contextMenu.selected) {
            document.getElementById("inventory-data").children[contextMenu.selected - 1].classList.remove("is-selected");
        }
        contextMenu.classList.add("is-hidden");
        contextMenu.dataset.id = "";
    }, false)

    for (const button of document.getElementsByClassName("ctx-menu-button")) {
        button.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        })
    }
}

async function addItemFormOnSubmit() {

    // clear old invalidation (if any)
    clearInvalidation(document.getElementById("add-item-form-name"));
    clearInvalidation(document.getElementById("add-item-form-quantity"));
    clearInvalidation(document.getElementById("add-item-form-image"));

    let invalid = false;

    // empty input validation
    if (!document.getElementById("add-item-form-name").value) {
        invalidateInput(document.getElementById("add-item-form-name"), "You need to enter an item name!");
        invalid = true;
    }
    if (!document.getElementById("add-item-form-quantity").value) {
        invalidateInput(document.getElementById("add-item-form-quantity"), "You need to enter a quantity!");
        invalid = true;
    } else if (isNaN(document.getElementById("add-item-form-quantity").value)) {
        // number validation
        invalidateInput(document.getElementById("add-item-form-quantity"), "That's not a number!");
        invalid = true;
    }

    let imageFile = document.getElementById("add-item-form-image").files[0];
    
    if (!imageFile) {
        // if no file is uploaded, error out and don't submit form
        document.getElementById("add-item-form-image").parentElement.parentElement.classList.add("is-danger");
        invalid = true;
    }

    if (invalid) { return; }

    await addNewItemToDatabase(
        document.getElementById("add-item-form-name").value,
        imageFile,                                      
        parseInt(document.getElementById("add-item-form-quantity").value),
        document.getElementById("add-item-form-location").value,
        document.getElementById("add-item-form-type").value
    );

    // Update table after adding new element
    updateTableFromServer()
    document.getElementById("add-item-modal").classList.remove("is-active")
    
}

function addProjectFormOnSubmit() {

    // clear old invalidation (if any)
    clearInvalidation(document.getElementById("add-project-form-name"));

    let invalid = false;

    // empty input validation
    if (!document.getElementById("add-project-form-name").value) {
        invalidateInput(document.getElementById("add-project-form-name"), "You need to enter a project name!");
        invalid = true;
    }

    if (invalid) { return; }

    addNewProject(
        document.getElementById("add-project-form-name").value,
    );

    document.getElementById("add-project-modal").classList.remove("is-active")
}

// event listener to hide modal
window.addEventListener("keydown", e => {
    if (e.key == "Escape") {
        document.getElementById("add-item-modal").classList.remove("is-active");
    }
});

// event listener for form file upload
document.getElementById("add-item-form-image").addEventListener("change", e => {
    if (!e.target.files) { return; }
    if (e.target.files[0].size > 2097152) {
        // invalidateInput(e.target, "Max image size is 2MB.");
        return;
    }

    // show filename next to button
    let span = document.createElement("span");
    span.className = "file-name";
    span.innerText = e.target.files[0].name;
    e.target.parentElement.appendChild(span);

    e.target.parentElement.parentElement.classList.add("has-name");
    
    // clear invalidation (if it was invalid before)
    clearInvalidation(e.target);
});

// event listeners for form text inputs
document.getElementById("add-item-form-name").addEventListener("input", e => {
    clearInvalidation(e.target);
    if (e.target.value) {
        clearInvalidation(e.target);
    } else {
        invalidateInput(e.target, "You need to enter an item name!");
    }
});
document.getElementById("add-item-form-quantity").addEventListener("input", e => {
    clearInvalidation(e.target);
    if (!e.target.value) {
        invalidateInput(e.target, "You need to enter a quantity!");
    } else if (isNaN(e.target.value)) {
        invalidateInput(e.target, "That's not a number!");
    } else {
        clearInvalidation(e.target);
    }
});

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

async function removeItemModalOpen() {
    let id = document.getElementById('context-menu').dataset.id;
    document.getElementById('remove-item-warning-modal').dataset.id = id;
    document.getElementById('remove-item-warning-modal').classList.toggle('is-active');
    document.getElementById('remove-item-warning-text').innerHTML = "Loading...";
    
    getObjectFromId('items', id).then((data) => {
        document.getElementById('remove-item-warning-text').innerHTML = `Do you want to remove ${data[0].name}?`;
    })
}

async function removeItem() {
    document.getElementById('remove-item-warning-modal').classList.toggle('is-active');
    await removeItemFromDatabase(document.getElementById('remove-item-warning-modal').dataset.id);
    await updateTableFromServer();
    document.getElementById('remove-item-warning-modal').dataset.id = "";
}