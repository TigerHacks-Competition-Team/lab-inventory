
// dark mode, load before other things so page doesn't flash white
let theme = window.localStorage.getItem("theme") || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
if (theme == "dark") {
    console.log(theme)
    enableDarkTheme()
}

function enableDarkTheme() {
    let link = document.createElement("link");
    link.id = "dark-theme";
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://unpkg.com/bulmaswatch/darkly/bulmaswatch.min.css";

    let head = document.getElementsByTagName("head")[0];
    head.insertBefore(link, document.getElementById("override-styles"));

    document.getElementById("theme-icon").classList.remove("fa-sun")
    document.getElementById("theme-icon").classList.add("fa-moon")

    document.body.className = "dark";
}

// dark mode button
document.getElementById("theme-button").addEventListener("click", e => {

    if (document.getElementById("dark-theme")) {

        document.getElementById("dark-theme").remove();
        document.body.classList.remove("dark");
        document.getElementById("theme-icon").classList.remove("fa-moon");
        document.getElementById("theme-icon").classList.add("fa-sun");

        window.localStorage.setItem("theme", "light")
    } else {
        window.localStorage.setItem("theme", "dark")
        enableDarkTheme();
    }
});


const { createClient } = supabase,
      _supabase = createClient('https://apdqcjlnovlnwziquaye.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZHFjamxub3Zsbnd6aXF1YXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ1Njg5NDAsImV4cCI6MTk4MDE0NDk0MH0.qESxhTdMvDRuGyNhC9C65S3Syq4iSIGMh5KEjTBG6K0');

var currentFilterType = FilterType.none;
var items = [];

// Prevent form from submitting when the Enter key is pressed
document.querySelector('#add-item-form').addEventListener("submit", (event) => {
    event.preventDefault();
});

window.onload = async () => {
    // Fetch server data on page load
    await updateTableFromServer()

    // Context menu logic
    document.querySelectorAll(".inventory-list-row").forEach(row => {
        row.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            let contextMenu = document.querySelector("#context-menu");
            contextMenu.classList.remove("is-hidden");
            contextMenu.style.left = event.pageX + "px";
            contextMenu.style.top = event.pageY + "px";
        }, false)
    });

    document.body.addEventListener("click", (event) => {
        let contextMenu = document.querySelector("#context-menu");
        contextMenu.classList.add("is-hidden")
    }, false)

    document.querySelectorAll(".ctx-menu-button").forEach(button => {
        button.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        })
    })
}

// TODO: set the file limit for images to 2MB only? Larger images brings supabase web client down to its knees
// - anhatthezoo 

function addItemFormOnSubmit() {

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

    let file = document.querySelector("#add-item-form-image").files[0];
    let reader;
    
    if (file) {
        reader = new FileReader();
        reader.readAsDataURL(file);
    } else {
        // if no file is uploaded, error out and don't submit form
        document.getElementById("add-item-form-image").parentElement.parentElement.classList.add("is-danger");
        invalid = true;
    }

    if (invalid) { return; }

    // Add item to database after FileReader has finished     
    reader.addEventListener("load", async () => {
        await addNewItemToDatabase(
            document.getElementById("add-item-form-name").value,
            reader.result,                                      // Image encoded as a base64 string
            parseInt(document.getElementById("add-item-form-quantity").value),
            document.getElementById("add-item-form-location").value,
            document.getElementById("add-item-form-type").value
        );

        // Update table after adding new element
        updateTableFromServer()
        document.getElementById("add-item-modal").classList.remove("is-active")
    });
    
}

// event listener to hide modal
window.addEventListener("keydown", e => {
    if (e.key == "Escape") {
        document.getElementById("add-item-modal").classList.remove("is-active");
    }
});

// show correct icons on sorting
for (let elem of document.getElementsByTagName("th")) {
    elem.addEventListener("click", e => {
        e.preventDefault();

        let top = elem.children[0].children[0];
        let bottom = elem.children[0].children[1];
        let sort = elem.dataset;

        // for some reason, on numeric columns, all the data is outdated (1 sort behind)
        // i think this has something to do with the event listener, maybe it sets the 
        // values later so this code runs before it is set?
        // i fixed this by just inverting ascending/descending if sortabletype is set
        // also, some weird stuff happens with sortedDirection, so this fixes that
        if (sort.sorted == "true" || sort.sortedDirection == undefined) {
            if (sort.sortedDirection == (sort.sortableType ? "descending": "ascending")) {
                top.className = "sort-icon-filled";
                bottom.className = "sort-icon-empty";
            } else {
                top.className = "sort-icon-empty";
                bottom.className = "sort-icon-filled";
            }

            // clear sorting icons on other headers
            for (const icon of elem.parentElement.getElementsByTagName("img")) {
                if (icon != top && icon != bottom) {
                    icon.className = "sort-icon-empty";
                }
            }
        } else {
            top.className = "sort-icon-empty";
            bottom.className = "sort-icon-empty";
        }

    })
}

// event listener for form file upload
document.getElementById("add-item-form-image").addEventListener("change", e => {
    if (!e.target.files) { return; }

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
document.getElementById("add-item-form-name").addEventListener("blur", e => {
    clearInvalidation(e.target);
    if (e.target.value) {
        clearInvalidation(e.target);
    } else {
        invalidateInput(e.target, "You need to enter an item name!");
    }
});
document.getElementById("add-item-form-quantity").addEventListener("blur", e => {
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