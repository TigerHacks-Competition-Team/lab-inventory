function addItemToTable(name, quantity, status) {
    let properties = [name, quantity, status],
        item = document.createElement("tr");

    for (var i = 0; i < 3; i++) {
        var propertyText = document.createTextNode(properties[i]),
            itemProperty = document.createElement("td");

        itemProperty.appendChild(propertyText)
        item.appendChild(itemProperty);
        document.getElementById("inventory_list").appendChild(item);   
    }

}

function filterInventoryTable() {
    let list = document.getElementById("inventory_list");
    while(list.rows.length > 1) { list.deleteRow(1); }
    
}