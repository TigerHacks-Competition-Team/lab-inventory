function addProjectFormOnSubmit() {

    // clear old invalidation (if any)
    clearInvalidation(document.getElementById("add-project-form-name"));

    let invalid = false;

    // empty input validation
    if (!document.getElementById("add-project-form-name").value) {
        invalidateInput(document.getElementById("add-project-form-name"), "You need to enter a project name!");
        invalid = true;
    }

    if (invalid) { return; }

    addNewProject(
        document.getElementById("add-project-form-name").value,
    );

    document.getElementById("add-project-modal").classList.remove("is-active")
}