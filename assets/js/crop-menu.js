function openCropMenu() {
    document.getElementById('crop-image-modal').classList.toggle('is-active');
    const currentImageInForm = document.getElementById('add-item-form-image').files[0];
    document.getElementById('crop-image-file-name').innerHTML = currentImageInForm.name;

    let img = new Image();
    img.src = window.URL.createObjectURL(currentImageInForm);
    img.onload = () => {
        document.getElementById('crop-image-original-size').innerHTML = `Original dimensions: ${img.naturalWidth} x ${img.naturalHeight}`;
        const canvas = document.getElementById('crop-image-preview'),
              ctx = canvas.getContext('2d');

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    }

}