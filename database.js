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