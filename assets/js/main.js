
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
    let file = document.querySelector("#add-item-form-image").files[0],
        reader = new FileReader();
    handleFocus(0);
    if (file) { reader.readAsDataURL(file); }
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
        document.querySelector("#add-item-rect").style.display = "none"
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
    elem.addEventListener("click", () => {

        let icon = elem.children[0].children[0];
        let sort = elem.dataset;

        console.log(sort.sortedDirection, sort)
   
        // for some reason, on numeric columns, all the data is outdated (1 sort behind)
        // i think this has something to do with the event listener, maybe it sets the 
        // values later so this code runs before it is set?
        // i fixed this by just inverting ascending/descending if sortabletype is set
        // also, some weird stuff happens with sortedDirection, so this fixes that
        if (sort.sorted == "true" || sort.sortedDirection == undefined) {
            if (sort.sortedDirection == (sort.sortableType ? "descending": "ascending")) {
                icon.src = "./assets/img/sort_up.svg";
            } else {
                icon.src = "./assets/img/sort_down.svg";
            }

            // clear sorting icons on other headers
            for (const otherIcon of elem.parentElement.getElementsByTagName("img")) {
                console.log(otherIcon);
                if (otherIcon != icon) {
                    otherIcon.src = "./assets/img/sort_empty.svg";
                }
            }
        } else {
            icon.src = "./assets/img/sort_empty.svg";
        }

    })
}