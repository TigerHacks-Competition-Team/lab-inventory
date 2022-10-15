const FilterType = {
    location: 'Location',
    itemType: 'Type',
    none: 'None'
}

function filterInventoryTable() {
    let table = document.getElementById("inventory-list"),
        tableIndex = table.children.length;
    
    while (tableIndex--) {
        let entry = table.children[tableIndex]

        // Dont remove table header, for some reason the table header tag came up as tbody istead of th
        if (entry.tagName === "THEAD") {continue}

        // Remove the table row
        entry.remove()
    }
}

function viewItemProfile() {
    document.getElementById("item-profile-rect").style.display = "block";
}
