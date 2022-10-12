const { createClient } = supabase,
      _supabase = createClient('https://apdqcjlnovlnwziquaye.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZHFjamxub3Zsbnd6aXF1YXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ1Njg5NDAsImV4cCI6MTk4MDE0NDk0MH0.qESxhTdMvDRuGyNhC9C65S3Syq4iSIGMh5KEjTBG6K0');

var currentFilterType = FilterType.none;
var items = [];

// Prevent form from submitting when the Enter key is pressed
function addItemFormEvent(event) { event.preventDefault(); }
document.querySelector('#add_item_form').addEventListener("submit", addItemFormEvent);

// TODO: set the file limit for images to 2MB only? Larger images brings supabase web client down to its knees
// - anhatthezoo 

function addItemFormOnSubmit() {
    const form = document.forms.add_item_form.elements;
    let file = document.querySelector("#add_item_form_image").files[0],
        reader = new FileReader();

    if (file) { reader.readAsDataURL(file); }
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
    });
    
}

function cancelForm() {
    document.querySelector('#add_item_rect').style.display = 'none';
}
