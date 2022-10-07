const FilterType = {
    location: 'Location',
    itemType: 'Type',
    none: 'None'
}


function filterInventoryTable() {
    let table = document.querySelector("#inventory_list"),
        tableIndex = table.children.length;
    
    while (tableIndex--) {
        let entry = table.children[tableIndex]

        // Dont remove table header, for some reason the table header tag came up as tbody istead of th
        if (entry.tagName === "TBODY") {continue}

        // Remove the table row
        entry.remove()
    }
}

