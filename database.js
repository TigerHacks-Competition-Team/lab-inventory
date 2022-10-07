async function addNewItemToDatabase(_name, _image, _quantity, _location, _type) {
    await _supabase
        .from('items')
        .insert([
            { 
                name: _name, 
                image: _image,
                totalQuantity: _quantity,
                location: _location,
                itemType: _type
            }
        ])
}

async function addNewLocation(_storageName, _storageType, _locationInLab) {
    await _supabase
        .from('locations')
        .insert([
            { storageName: _storageName, storageType: _storageType, locationInLab: _locationInLab}
        ])
}

async function addNewItemType(_name) {
    await _supabase
        .from('itemTypes')
        .insert([
            { name: _name }
        ])
}

async function addItemFormUpdateDropLists() {
    var { data, error } = await _supabase
        .from('locations')
        .select();
    const locationList = document.getElementById("add_item_form_location"),
          itemTypeList = document.getElementById("add_item_form_type");

    for (var i = 0; i < data.length; i++){
        let option = document.createElement("option"),
            optionText = document.createTextNode(data[i].locationInLab);
        option.value = data[i].id;
        option.appendChild(optionText);
        locationList.appendChild(option);
    }

    var { data, err } = await _supabase
        .from('itemTypes')
        .select();

    for (var i = 0; i < data.length; i++){
        let option = document.createElement("option"),
            optionText = document.createTextNode(data[i].name);
        option.value = data[i].id;
        option.appendChild(optionText);
        itemTypeList.appendChild(option);
    }

    document.getElementById('add_item_form').style.display = 'block';
}

// Gets items from database and puts them into table
function updateTableFromServer() {
    // Get items from database
    _supabase
        .from('items')
        .select()
        .then(({error, data}) => {
            // Check for errors
            if (error) {
                console.error(`Error when fetching server entries, "${error}"`)
                return
            }
            
            // Get table element and length of children for removing elements
            let table = document.querySelector("#inventory_list")
            let tableIndex = table.children.length

            // Remove all elements from table, we do it like this instead of a "for of" loop because
            // removing elements from an array while looping through that array causes it to only remove
            // half the elements
            while (tableIndex--) {
                let entry = table.children[tableIndex]

                // Dont remove table header, for some reason the table header tag came up as tbody istead of th
                if (entry.tagName === "TBODY") {continue}

                // Remove the table row
                entry.remove()
            }

            // If no errors are present, loop through each item
            for (const item of data) {
                // create table row and append it to the main table
                let tableRow = document.createElement("tr")
                table.appendChild(tableRow)
                
                // create the table data elements
                let nameEntry = document.createElement("td")
                let quantityEntry = document.createElement("td")
                let statusEntry = document.createElement("td") // Im not sure what to put in this, so for now im leaving it empty
                
                // append table data to table row
                tableRow.appendChild(nameEntry)
                tableRow.appendChild(quantityEntry)
                tableRow.appendChild(statusEntry)

                // add server data to table data elements
                nameEntry.innerHTML = item.name
                quantityEntry.innerHTML = item.totalQuantity
            }
        })
}