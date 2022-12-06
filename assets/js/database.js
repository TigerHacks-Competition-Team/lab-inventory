async function addNewItemToDatabase(_name, _image, _quantity, _location, _type) {
    let fileExtension = _image.type.split("/")[1];
    return uploadImage(_image, _name, fileExtension).then(() => 
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

async function uploadImage(_image, _item_id, _extension) {
    return _supabase.storage.from("images").upload(`items/${_item_id}.${_extension}`, _image)
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

async function addItemFormUpdateDropLists() {
    var { data, error } = await _supabase
        .from('locations')
        .select();
    const locationList = document.getElementById("add-item-form-location"),
          itemTypeList = document.getElementById("add-item-form-type");

    let locationLength = locationList.children.length
    while (locationLength--) {
        locationList.children[locationLength].remove()
    }

    for (const item of data){
        let option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item.locationInLab;
        locationList.appendChild(option);
    }

    var { data, err } = await _supabase
        .from('itemTypes')
        .select();

    let itemTypeLength = itemTypeList.children.length
    while (itemTypeLength--) {
        itemTypeList.children[itemTypeLength].remove()
    }

    for (const item of data){
        let option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item.name;
        itemTypeList.appendChild(option);
    }

    document.getElementById("add-item-modal").classList.toggle("is-active");
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

function selectProject(projectName) {
    document.getElementById(selectedProject).className = "project-tab";
    selectedProject = projectName;
    document.getElementById(selectedProject).className = "project-tab is-active";
}

// Gets items from database and puts them into table
async function updateTableFromServer() {
    //Loading animation
    let loading = document.getElementById('loading');
    loading.classList.toggle('is-active');
    document.getElementById('inventory-list').style = "display: none";

    // Get table items from database
    const {error: tableError, data: tableData} = await _supabase
        .from('items')
        .select('name, totalQuantity, image, checkouts, locations ( storageName, storageType, locationInLab ), itemTypes ( name )')
    
    // Get project items from database
    const {error: projectError, data: projectData} = await _supabase
        .from('projects')
        .select('name')

    // Check table for errors
    if (tableError) {
        console.error(`Error when fetching table entries, "${tableError}"`)
        return
    }
    // Check projects for errors
    if (projectError) {
        console.error(`Error when fetching project entries, "${projectError}"`)
        return
    }
    
    // Get table element and length of children for removing elements
    let table = document.getElementById("inventory-data"),
        tableIndex = table.children.length;
    
    // Get all project tab elements and length for removing elements, NodeListOf type does not have filter, so [...] converts it to an array
    let projectTabs = [...document.querySelectorAll(".project-tab")].filter(a => a.id != "All Items"),
        projectTabIndex = projectTabs.length

    // Remove all elements from table, we do it like this instead of a "for of" loop because
    // removing elements from an array while looping through that array causes it to only remove
    // half the elements
    while (tableIndex--) {
        let entry = table.children[tableIndex]

        // Dont remove table header, for some reason the table header tag came up as tbody istead of th
        if (entry.tagName === "THEAD") {continue}

        // Remove the table row
        entry.remove()
    }

    // Remove all project tabs
    while (projectTabIndex--) {
        let entry = projectTabs[projectTabIndex]

        // Remove the project tab
        entry.remove();
    }

    // If no errors are present, loop through each item
    for (const item of tableData) {
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
            _image = document.createElement('img');

        
        location.innerHTML = item.locations.locationInLab;
        type.innerHTML = item.itemTypes.name;

        await downloadImage(item.image).then((data) => {
            let reader = new FileReader();
            reader.readAsDataURL(data.data);
            reader.onloadend = function() {
                _image.src = reader.result;
                item.imageData = reader.result
            }
        })

        _image.width = 128;
        _image.height = 128;
        image.appendChild(_image);

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

    // Checks to see if the selected project still exists in the server
    let foundSelected = false;

    // Add each project from the server to the document
    for (const item of projectData) {
        // Format: <li id="project-tab"><a>Project Name</a></li>

        // The outside <li> element and the inner <a> element
        let projectTabListItem = document.createElement("li")
        let projectTabLinkItem = document.createElement("a")

        // Set link's text to the name
        projectTabLinkItem.textContent = item.name

        // Put link in list item
        projectTabListItem.appendChild(projectTabLinkItem)

        // Add the ID and class to the list item
        projectTabListItem.id = item.name
        projectTabListItem.className = "project-tab"

        // Check if project is selected and add class
        if (selectedProject == item.name) {
            foundSelected = true
            projectTabListItem.class += " is-active"
        }

        // Click handler
        projectTabLinkItem.onclick = () => {
            selectProject(projectTabListItem.id)
        }

        // Get the projects tab and insert list item
        let allItemsTab = document.getElementById("projects")
        allItemsTab.appendChild(projectTabListItem)
    }

    // Select "All Items" if the selected one was not found
    if (foundSelected) {
        document.getElementById("All Items").removeAttribute("class")
    } else {
        document.getElementById("All Items").className = "is-active"
    }

    loading.classList.toggle('is-active');
    document.getElementById('inventory-list').style = "display: visible;";
}
