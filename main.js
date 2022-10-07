const { createClient } = supabase,
      _supabase = createClient('https://apdqcjlnovlnwziquaye.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZHFjamxub3Zsbnd6aXF1YXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ1Njg5NDAsImV4cCI6MTk4MDE0NDk0MH0.qESxhTdMvDRuGyNhC9C65S3Syq4iSIGMh5KEjTBG6K0');

var currentFilterType = FilterType.location;
var items = [];

//addNewLocation("red box", "box", "corner");
//addNewItemType("PCB");

function addItemFormEvent(event) { event.preventDefault(); }
document.getElementById('add_item_form').addEventListener("submit", addItemFormEvent);
function addItemFormOnSubmit() {
    const form = document.forms.add_item_form.elements;
    addNewItemToDatabase(
        form.add_item_form_name.value,
        form.add_item_form_image.value,
        parseInt(form.add_item_form_quantity.value),
        form.add_item_form_location.value,
        form.add_item_form_type.value
    )
    
    // Update table after adding new element
    updateTableFromServer()
}

// Fetch server data on page load
updateTableFromServer()