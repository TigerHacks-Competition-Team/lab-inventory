const { createClient } = supabase,
      _supabase = createClient('https://apdqcjlnovlnwziquaye.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZHFjamxub3Zsbnd6aXF1YXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ1Njg5NDAsImV4cCI6MTk4MDE0NDk0MH0.qESxhTdMvDRuGyNhC9C65S3Syq4iSIGMh5KEjTBG6K0');

// Prevent form from submitting when the Enter key is pressed
document.getElementById("add-item-form").addEventListener("submit", (e) => { e.preventDefault(); });
document.getElementById("add-project-form").addEventListener("submit", (e) => { e.preventDefault(); });

// 12/4/22 - Anh: move different menu code to their respective .js files
// new files: add-item-menu.js, crop-image.js, project-menu.js
// main.js is getting too long

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

async function showViewItem(item) {
    document.getElementById("view-item-modal").classList.toggle("is-active");
    document.getElementById("view-item-title").innerText = item.name
    document.getElementById("view-item-img").src = item.imageData;
    document.getElementById("view-item-type").innerText = `Type: ${item.itemTypes.name}`
    document.getElementById("view-item-location").innerHTML = `Location: <strong>${item.locations.storageType}</strong> called <strong>${item.locations.storageName}</strong> in <strong>${item.locations.locationInLab}</strong>`
    document.getElementById("view-item-quantity").innerHTML = `<strong>${item.totalQuantity}</strong>/${item.totalQuantity} available, <strong>${item.totalQuantity}</strong> in use`
}