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
            { 
                storageName: _storageName, 
                storageType: _storageType, 
                locationInLab: _locationInLab
            }
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
    const locationList = document.querySelector("#add_item_form_location"),
          itemTypeList = document.querySelector("#add_item_form_type");

    for (const item of data){
        let option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item.locationInLab;
        locationList.appendChild(option);
    }

    var { data, err } = await _supabase
        .from('itemTypes')
        .select();

    for (const item of data){
        let option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item.name;
        itemTypeList.appendChild(option);
    }

    let root = document.getElementById('root');
    root.classList.remove('add_focus');
    root.classList.add('remove_focus');

    let form = document.querySelector('#add_item_rect');
    form.classList.remove('add_focus');
    form.classList.add('add_focus');
    form.style.display = 'block';
}

async function getObjectFromId(table, id) {
    const {data, error} = await _supabase
        .from(table)
        .select()
        .eq('id', id);

    return data;
}

// Gets items from database and puts them into table
async function updateTableFromServer() {
    // Get items from database
    const {error, data} = await _supabase
        .from('items')
        .select()

    // Check for errors
    if (error) {
        console.error(`Error when fetching server entries, "${error}"`)
        return
    }
    
    // Get table element and length of children for removing elements
    let table = document.querySelector("#inventory_list"),
        tableIndex = table.children.length;

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
        let tableRow = document.createElement("tr");
        tableRow.className = "inventory_list_row";
        tableRow.dataset.id = item.id;
        table.appendChild(tableRow);
        
        // create the table data elements
        let name = document.createElement("td"),
            quantity = document.createElement("td"),
            location = document.createElement("td"),
            type = document.createElement('td');

        let _location = getObjectFromId('locations', item.location).then(function(data) {
            location.innerHTML = data[0].locationInLab;
        });

        let _type = getObjectFromId('itemTypes', item.itemType).then(function(data) {
            type.innerHTML = data[0].name;
        })

        // add server data to table data elements
        name.innerHTML = item.name;
        quantity.innerHTML = item.totalQuantity;

        // append table data to table row
        tableRow.appendChild(name);
        tableRow.appendChild(quantity);
        tableRow.appendChild(location);
        tableRow.appendChild(type);
        
    }
}
