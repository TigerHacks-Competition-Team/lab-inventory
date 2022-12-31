async function addNewItemToDatabase(_name, _img, _quantity, _location, _type) {
    let fileExtension = _img.type.split("/")[1];
    return uploadImage(_img, _name, fileExtension).then(() => 
        _supabase
        .from('items')
        .insert([
            { 
                name: _name,
                image: `items/${_name}.${fileExtension}`,
                totalQuantity: _quantity,
                location: _location,
                itemType: _type
            }
        ])
    ).catch((err) => console.warn(err))
}

async function uploadImage(_img, _item_id, _extension) {
    return _supabase.storage.from("images")
           .upload(`items/${_item_id}.${_extension}`, _img)
}

async function downloadImage(imagePath) {
    if (imagePath === null || !imagePath.match(/items\//)) {
        return _supabase.storage.from('images').download('items/default.png');
    }
    return _supabase.storage.from('images').download(imagePath);
}

async function addNewProject(_name) {
    await _supabase
        .from('projects')
        .insert([
            { 
                name: _name, 
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

async function getObjectFromId(table, id) {
    const {data, error} = await _supabase
        .from(table)
        .select()
        .eq('id', id);

    return data;
}

async function removeItemFromDatabase(id) {
    return _supabase.from('items').delete().eq('id', id);
}

async function addProjectFormUpdateDropLists() {
    document.getElementById("add-project-modal").classList.toggle("is-active");
}

// Gets items from database and puts them into table
async function updateTableFromServer() {
    //Loading animation
    let loading = document.getElementById('loading');
    loading.classList.remove('is-hidden');

    // Get items from database
    const {error, data} = await _supabase
        .from('items')
        .select(`name, totalQuantity, image, 
                locations ( storageName, storageType, locationInLab ), 
                itemTypes ( name )`);

    console.log(JSON.stringify(data[0]))
    // Check for errors
    if (error) {
        console.error(`Error when fetching server entries, "${error}"`)
        return
    }
    
    // Get table element and length of children for removing elements
    let table = document.getElementById("inventory-data"),
        tableIndex = table.children.length;

    // Remove all elements from table, we do it like this instead of a 
    // "for of" loop because removing elements from an array while looping 
    // through that array causes it to only remove half the elements
    while (tableIndex--) {
        let entry = table.children[tableIndex]

        // Dont remove table header, for some reason the table header tag 
        // came up as <tbody> instead of <th>
        if (entry.tagName === "THEAD") {continue}

        // Remove the table row
        entry.remove()
    }

    // If no errors are present, loop through each item
    for(const item of data) {
        // create table row and append it to the main table
        let tableRow = document.createElement("tr");
        tableRow.className = "inventory-list-row";
        tableRow.dataset.id = item.id;
        
        // create the table data elements
        let name = document.createElement("td"),
            quantity = document.createElement("td"),
            location = document.createElement("td"),
            type = document.createElement('td'),
            image = document.createElement('td'),
            _img = document.createElement('img');

        
        location.innerHTML = item.locations.locationInLab;
        type.innerHTML = item.itemTypes.name;

        await downloadImage(item.image).then((data) => {
            let reader = new FileReader();
            reader.readAsDataURL(data.data);
            reader.onloadend = function() {
                _img.src = reader.result;
                item.imageData = reader.result
            }
        })

        _img.width = 128;
        _img.height = 128;
        image.appendChild(_img);

        // add server data to table data elements
        name.innerHTML = item.name;
        quantity.innerHTML = item.totalQuantity;

        // append table data to table row
        tableRow.appendChild(image);
        tableRow.appendChild(name);
        tableRow.appendChild(quantity);
        tableRow.appendChild(location);
        tableRow.appendChild(type);

        // find location to insert tableRow
        let inserted = false;
        for (const elem of table.children) {
            // if the name for the row to add goes before
            if (elem.children[0].innerText.localeCompare(item.name) > 0) {
                table.insertBefore(tableRow, elem);
                inserted = true;
                break;
            }
        }
        
        if (!inserted) {
            table.appendChild(tableRow);
        }

        tableRow.onclick = () => showViewItem(item)
        
    }

    // hide loading animation
    loading.classList.add('is-hidden');
}
