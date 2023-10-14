// event listener to hide modal
window.addEventListener("keydown", e => {
    if (e.key == "Escape") {
        document.getElementById("add-item-modal").classList.remove("is-active");
    }
});

const itemFormName = document.getElementById("add-item-form-name"),
      itemFormQuantity = document.getElementById("add-item-form-quantity"),
      itemFormImage = document.getElementById("add-item-form-image"),
      itemFormLocation = document.getElementById("add-item-form-location"),
      itemFormType = document.getElementById("add-item-form-type");

async function addItemFormUpdateDropLists() {
    var { data, error } = await _supabase
        .from('locations')
        .select();

    let locationLength = itemFormLocation.children.length
    while (locationLength--) {
        itemFormLocation.children[locationLength].remove();
    }

    for (const item of data){
        let option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item.locationInLab;
        itemFormLocation.appendChild(option);
    }

    var { data, err } = await _supabase
        .from('itemTypes')
        .select();

    let itemTypeLength = itemFormType.children.length
    while (itemTypeLength--) {
        itemFormType.children[itemTypeLength].remove()
    }

    for (const item of data){
        let option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item.name;
        itemFormType.appendChild(option);
    }

    document.getElementById("add-item-modal").classList.toggle("is-active");
}

async function addItemFormOnSubmit() {

    // clear old invalidation (if any)
    clearInvalidation(itemFormName);
    clearInvalidation(itemFormQuantity);
    clearInvalidation(itemFormImage);

    let invalid = false;

    // empty input validation
    if (!itemFormName.value) {
        invalidateInput(itemFormName, "You need to enter an item name!");
        invalid = true;
    }
    if (!itemFormQuantity.value) {
        invalidateInput(itemFormQuantity, "You need to enter a quantity!");
        invalid = true;
    } else if (isNaN(itemFormQuantity.value)) {
        // number validation
        invalidateInput(itemFormQuantity, "That's not a number!");
        invalid = true;
    }

    let imageFile = itemFormImage.files[0];
    
    if (!imageFile) {
        // if no file is uploaded, error out and don't submit form
        itemFormImage.parentElement.parentElement.classList.add("is-danger");
        invalid = true;
    }

    if (invalid) { return; }

    await addNewItemToDatabase(
        itemFormName.value,
        imageFile,                                      
        parseInt(itemFormQuantity.value),
        itemFormLocation.value,
        itemFormType.value
    );

    // Update table after adding new element
    updateTableFromServer()
    document.getElementById("add-item-modal").classList.remove("is-active")
    
}

// event listener for form file upload
itemFormImage.addEventListener("change", (e) => {
    if (!e.target.files) { return; }
    if (e.target.files[0].size > 2097152) {
        // invalidateInput(e.target, "Max image size is 2MB.");
        return;
    }

    // show filename next to button
    // 12/4/22 - Anh: show only one span with filename at a time
    const fileName = document.getElementsByClassName('file-name');
    if (fileName.length == 0) {
        let span = document.createElement("span");
        span.className = "file-name";
        span.innerText = e.target.files[0].name;
        e.target.parentElement.appendChild(span);
    
        e.target.parentElement.parentElement.classList.add("has-name");
    } else {
        fileName[0].innerText = e.target.files[0].name;
    }
    
    document.getElementById('file-crop-image').classList.remove('is-hidden');
    
    // clear invalidation (if it was invalid before)
    clearInvalidation(e.target);
});

// event listeners for form text inputs
itemFormName.addEventListener("input", (e) => {
    clearInvalidation(e.target);
    if (e.target.value) {
        clearInvalidation(e.target);
    } else {
        invalidateInput(e.target, "You need to enter an item name!");
    }
});
itemFormQuantity.addEventListener("input", (e) => {
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
    clearInvalidation(itemFormName);
    clearInvalidation(itemFormQuantity);
    clearInvalidation(itemFormImage);

    let fileNameSpans = document.getElementsByClassName('file-name');
    if (fileNameSpans.length > 0)
        document.getElementById('file-crop-image').classList
                                                  .toggle('is-hidden');
    while (fileNameSpans.length > 0) 
        fileNameSpans[0].parentNode.removeChild(fileNameSpans[0]);
}