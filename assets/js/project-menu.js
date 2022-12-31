function addProjectFormOnSubmit() {
    const nameInput = document.getElementById("add-project-form-name");
    // clear old invalidation (if any)
    clearInvalidation(nameInput);

    let invalid = false;

    // empty input validation
    if (!nameInput.value) {
        invalidateInput(nameInput, "You need to enter a project name!");
        invalid = true;
    }

    if (invalid) { return; }

    addNewProject( nameInput.value );

    document.getElementById("add-project-modal").classList.remove("is-active")
}