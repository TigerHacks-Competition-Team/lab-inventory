var isMouseDown = false;
var cropMenuImage = null;

function cropMenuDrawCanvas(img, scale, translateX, translateY) {
    const canvas = document.getElementById('crop-image-preview'),
          ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    ctx.scale(scale, scale);
    translateX += (canvas.width / scale - img.width) / 2;
    translateY += (canvas.height / scale - img.height) / 2;
    ctx.drawImage(img, translateX, translateY);

    ctx.restore();
}

function openCropMenu() {
    document.getElementById('crop-image-modal').classList.toggle('is-active');
    const currentImageInForm = document.getElementById('add-item-form-image').files[0],
          canvas = document.getElementById('crop-image-preview');
    document.getElementById('crop-image-file-name').innerHTML = currentImageInForm.name;

    window.cropMenuImage = new Image();
    window.cropMenuImage.src = window.URL.createObjectURL(currentImageInForm);
    window.cropMenuImage.onload = () => {
        document.getElementById('crop-image-original-size').innerHTML = `Original dimensions: ${window.cropMenuImage.naturalWidth} x ${window.cropMenuImage.naturalHeight}`;
        canvas.dataset.scale = "1.0";
        canvas.dataset.translateX = "0";
        canvas.dataset.translateY = "0";
        canvas.dataset.dragOffsetX = "0";
        canvas.dataset.dragOffsetY = "0";

        cropMenuDrawCanvas(window.cropMenuImage, 1, 0, 0);
    }
}

document.getElementById('crop-image-zoom-up').addEventListener("click", () => {
    const canvas = document.getElementById('crop-image-preview');
    let scale = parseFloat(canvas.dataset.scale),
        translateX = parseFloat(canvas.dataset.translateX),
        translateY = parseFloat(canvas.dataset.translateY);

    canvas.dataset.scale = scale + 0.5;
    cropMenuDrawCanvas(window.cropMenuImage, parseFloat(canvas.dataset.scale), translateX, translateY);
});
document.getElementById('crop-image-zoom-down').addEventListener("click", () => {
    const canvas = document.getElementById('crop-image-preview');
    let scale = parseFloat(canvas.dataset.scale),
        translateX = parseFloat(canvas.dataset.translateX),
        translateY = parseFloat(canvas.dataset.translateY);

    canvas.dataset.scale = scale - 0.5;
    cropMenuDrawCanvas(window.cropMenuImage, parseFloat(canvas.dataset.scale), translateX, translateY);
});

document.getElementById('crop-image-preview').addEventListener("mousedown", (e) => {
    const canvas = document.getElementById('crop-image-preview');
    window.isMouseDown = true;
    canvas.dataset.dragOffsetX = e.clientX - parseFloat(canvas.dataset.translateX);
    canvas.dataset.dragOffsetY = e.clientY - parseFloat(canvas.dataset.translateY);

});
document.getElementById('crop-image-preview').addEventListener("mouseup", () => { window.isMouseDown = false; });
document.getElementById('crop-image-preview').addEventListener("mouseover", () => { window.isMouseDown = false; });
document.getElementById('crop-image-preview').addEventListener("mouseout", () => { window.isMouseDown = false; });
document.getElementById('crop-image-preview').addEventListener("mousemove", (e) => {
    const canvas = document.getElementById('crop-image-preview');
    if (window.isMouseDown) {
        canvas.dataset.translateX = e.clientX - parseFloat(canvas.dataset.dragOffsetX);
        canvas.dataset.translateY = e.clientY - parseFloat(canvas.dataset.dragOffsetY);
        cropMenuDrawCanvas(window.cropMenuImage, 
                           parseFloat(canvas.dataset.scale), 
                           parseFloat(canvas.dataset.translateX),
                           parseFloat(canvas.dataset.translateY));
    }
});