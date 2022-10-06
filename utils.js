const FilterType = {
    location: 'Location',
    itemType: 'Type'
}

function addItemToTable(name, quantity, status) {
    
}

function filterInventoryTable() {
    let list = document.getElementById("inventory_list");
    document.getElementById('filter_by_text').textContent = currentFilterType;
    while(list.rows.length > 1) { list.deleteRow(1); }
    
}

