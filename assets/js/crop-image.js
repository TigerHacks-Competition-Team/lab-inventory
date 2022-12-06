var isMouseDown = false;
var cropMenuImage = null;
var croppedImageSize = 512;

function cropMenuDrawCanvas(scale, translateX, translateY) {
    const canvas = document.getElementById('crop-image-preview'),
          ctx = canvas.getContext('2d'),
          img = window.cropMenuImage;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.save();
    
    // Zoom in on the center of the canvas
    ctx.scale(scale, scale);
    translateX += (canvas.width / scale - img.width) / 2;
    translateY += (canvas.height / scale - img.height) / 2;
    ctx.drawImage(img, translateX, translateY);

    ctx.restore();

    // Drawing borders
    ctx.globalAlpha = 0.5;
    const croppedImageSize = window.croppedImageSize;
    ctx.fillRect(0, 0, canvas.width, (canvas.height / 2) - croppedImageSize / 2);                      // Top border
    ctx.fillRect(0, (canvas.height / 2) + croppedImageSize / 2,                                        // Bottom border
                 canvas.width, (canvas.height / 2) - croppedImageSize / 2);                            
    ctx.fillRect(0, (canvas.height / 2) - (croppedImageSize / 2),                                      // Left border
                 (canvas.width - croppedImageSize) / 2, croppedImageSize);                             
    ctx.fillRect((canvas.width / 2) + (croppedImageSize / 2),                                          // Right border
                 (canvas.height / 2) - (croppedImageSize / 2), 
                 (canvas.width - croppedImageSize) / 2, croppedImageSize);                             
}

function cropMenuCropImage() {
    const canvas = document.getElementById('crop-image-preview'),
          ctx = canvas.getContext('2d'),
          croppedImageSize = window.croppedImageSize; 

    let imageData = ctx.getImageData((canvas.width - croppedImageSize) / 2, (canvas.height / 2) - (croppedImageSize / 2), 
                                     (canvas.width - croppedImageSize) / 2 + croppedImageSize, 
                                     (canvas.height / 2) + croppedImageSize / 2);
    let buffer = document.createElement('canvas'),
        bufferCtx = buffer.getContext('2d');
    buffer.width = 512;
    buffer.height = 512;
    bufferCtx.putImageData(imageData, 0, 0);
    
    // Create a new image file based on the cropped region
    buffer.toBlob((blob) => {
        let file = new File([blob], "cropped.png", {type:"image/png", lastModified:new Date().getTime()});
        let container = new DataTransfer();
        container.items.add(file);
        document.getElementById('add-item-form-image').files = container.files;
    })

    document.getElementById('crop-image-modal').classList.remove('is-active');
    
}

function openCropMenu() {
    document.getElementById('crop-image-modal').classList.toggle('is-active');
    const currentImageInForm = document.getElementById('add-item-form-image').files[0],
          canvas = document.getElementById('crop-image-preview');

    window.cropMenuImage = new Image();
    window.cropMenuImage.src = window.URL.createObjectURL(currentImageInForm);
    window.cropMenuImage.onload = () => {
        canvas.dataset.translateX = "0";
        canvas.dataset.translateY = "0";
        canvas.dataset.dragOffsetX = "0";
        canvas.dataset.dragOffsetY = "0";

        cropMenuDrawCanvas(1, 0, 0);
    }
}

function cropMenuSetScale(t) {
    const slider = document.getElementById("crop-image-scale-slider"),
          canvas = document.getElementById('crop-image-preview');
    slider.value = parseFloat(slider.value) + t;
    cropMenuDrawCanvas(parseFloat(slider.value), parseFloat(canvas.dataset.translateX), parseFloat(canvas.dataset.translateY));
}

// Dragging logic
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
    const canvas = document.getElementById('crop-image-preview'),
          slider = document.getElementById("crop-image-scale-slider");
    if (window.isMouseDown) {
        canvas.dataset.translateX = e.clientX - parseFloat(canvas.dataset.dragOffsetX);
        canvas.dataset.translateY = e.clientY - parseFloat(canvas.dataset.dragOffsetY);
        cropMenuDrawCanvas(parseFloat(slider.value), parseFloat(canvas.dataset.translateX), parseFloat(canvas.dataset.translateY));
    }
});
