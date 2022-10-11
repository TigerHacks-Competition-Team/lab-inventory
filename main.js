const { createClient } = supabase,
      _supabase = createClient('https://apdqcjlnovlnwziquaye.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZHFjamxub3Zsbnd6aXF1YXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ1Njg5NDAsImV4cCI6MTk4MDE0NDk0MH0.qESxhTdMvDRuGyNhC9C65S3Syq4iSIGMh5KEjTBG6K0');

var currentFilterType = FilterType.none;
var items = [];

// Prevent form from submitting when the Enter key is pressed
document.querySelector('#add_item_form').addEventListener("submit", (event) => {
    event.preventDefault();
});

window.onload = async () => {
    // Fetch server data on page load
    await updateTableFromServer()

    // Context menu logic
    document.querySelectorAll(".inventory_list_row").forEach(row => {
        row.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            let contextMenu = document.querySelector("#context_menu");
            contextMenu.className = "ctx_menu_show";
            contextMenu.style.left = (event.pageX - 20) + "px";
            contextMenu.style.top = (event.pageY - 20) + "px";
        }, false)
    });

    document.body.addEventListener("click", (event) => {
        let contextMenu = document.querySelector("#context_menu");
        if (contextMenu.className == "ctx_menu_hide") { return; }

        contextMenu.className = "ctx_menu_hide";
    }, false)

    document.querySelectorAll(".ctx_menu_button").forEach(button => {
        button.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        })
    })
}

// TODO: set the file limit for images to 2MB only? Larger images brings supabase web client down to its knees
// - anhatthezoo 

function addItemFormOnSubmit() {
    const form = document.forms.add_item_form.elements;
    let file = document.querySelector("#add_item_form_image").files[0],
        reader = new FileReader();

    if (file) { reader.readAsDataURL(file); } else {
        addNewItemToDatabase(
            form.add_item_form_name.value,
            undefined,
            parseInt(form.add_item_form_quantity.value),
            form.add_item_form_location.value,
            form.add_item_form_type.value
        ).then(() => {
            updateTableFromServer()
            document.querySelector("#add_item_rect").style.display = "none"
        })
    }
    // Add item to database after FileReader has finished     
    reader.addEventListener("load", async () => {
        await addNewItemToDatabase(
            form.add_item_form_name.value,
            reader.result,                                      // Image encoded as a base64 string
            parseInt(form.add_item_form_quantity.value),
            form.add_item_form_location.value,
            form.add_item_form_type.value
        );

        // Update table after adding new element
        updateTableFromServer()
        document.querySelector("#add_item_rect").style.display = "none"
    });
    
}

function cancelForm() {
    document.querySelector('#add_item_rect').style.display = 'none';
}