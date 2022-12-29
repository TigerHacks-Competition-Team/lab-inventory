// event listener to hide modal
window.addEventListener("keydown", e => {
    if (e.key == "Escape") {
        document.getElementById("add-item-modal").classList.remove("is-active");
    }
});

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

async function addItemFormOnSubmit() {

    // clear old invalidation (if any)
    clearInvalidation(document.getElementById("add-item-form-name"));
    clearInvalidation(document.getElementById("add-item-form-quantity"));
    clearInvalidation(document.getElementById("add-item-form-image"));

    let invalid = false;

    // empty input validation
    if (!document.getElementById("add-item-form-name").value) {
        invalidateInput(document.getElementById("add-item-form-name"), "You need to enter an item name!");
        invalid = true;
    }
    if (!document.getElementById("add-item-form-quantity").value) {
        invalidateInput(document.getElementById("add-item-form-quantity"), "You need to enter a quantity!");
        invalid = true;
    } else if (isNaN(document.getElementById("add-item-form-quantity").value)) {
        // number validation
        invalidateInput(document.getElementById("add-item-form-quantity"), "That's not a number!");
        invalid = true;
    }

    let imageFile = document.getElementById("add-item-form-image").files[0];
    
    if (!imageFile) {
        // if no file is uploaded, error out and don't submit form
        document.getElementById("add-item-form-image").parentElement.parentElement.classList.add("is-danger");
        invalid = true;
    }

    if (invalid) { return; }

    await addNewItemToDatabase(
        document.getElementById("add-item-form-name").value,
        imageFile,                                      
        parseInt(document.getElementById("add-item-form-quantity").value),
        document.getElementById("add-item-form-location").value,
        document.getElementById("add-item-form-type").value
    );

    // Update table after adding new element
    updateTableFromServer()
    document.getElementById("add-item-modal").classList.remove("is-active")
    
}

// event listener for form file upload
document.getElementById("add-item-form-image").addEventListener("change", e => {
    if (!e.target.files) { return; }
    if (e.target.files[0].size > 2097152) {
        // invalidateInput(e.target, "Max image size is 2MB.");
        return;
    }

    // show filename next to button
    // 12/4/22 - Anh: show only one span with filename at a time
    if (document.getElementsByClassName('file-name').length == 0) {
        let span = document.createElement("span");
        span.className = "file-name";
        span.innerText = e.target.files[0].name;
        e.target.parentElement.appendChild(span);
    
        e.target.parentElement.parentElement.classList.add("has-name");
    } else {
        document.getElementsByClassName('file-name')[0].innerText = e.target.files[0].name;
    }
    
    document.getElementById('file-crop-image').classList.remove('is-hidden');
    
    // clear invalidation (if it was invalid before)
    clearInvalidation(e.target);
});

// event listeners for form text inputs
document.getElementById("add-item-form-name").addEventListener("input", e => {
    clearInvalidation(e.target);
    if (e.target.value) {
        clearInvalidation(e.target);
    } else {
        invalidateInput(e.target, "You need to enter an item name!");
    }
});
document.getElementById("add-item-form-quantity").addEventListener("input", e => {
    clearInvalidation(e.target);
    if (!e.target.value) {
        invalidateInput(e.target, "You need to enter a quantity!");
    } else if (isNaN(e.target.value)) {
        invalidateInput(e.target, "That's not a number!");
    } else {
        clearInvalidation(e.target);
    }
});

async function clearAddItemMenu() {
    // Clear the form
    document.getElementById('add-item-form').reset();

    // Remove invalidations 
    clearInvalidation(document.getElementById("add-item-form-name"));
    clearInvalidation(document.getElementById("add-item-form-quantity"));
    clearInvalidation(document.getElementById("add-item-form-image"));

    
    let fileNameSpans = document.getElementsByClassName('file-name');
    if (fileNameSpans.length > 0)
        document.getElementById('file-crop-image').classList.toggle('is-hidden');
    while (fileNameSpans.length > 0) 
        fileNameSpans[0].parentNode.removeChild(fileNameSpans[0]);
}