var isMouseDown = false;
var cropSrcImg = null;
var cropMaxSize = 512;

function cropMenuDrawCanvas(scale, translateX, translateY) {
    const canvas = document.getElementById('crop-image-preview'),
          ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = cropSrcImg.naturalWidth;
    canvas.height = cropSrcImg.naturalHeight;

    const cWidth = canvas.width;
    const cHeight = canvas.height;

    ctx.save();
    
    // Zoom in on the center of the canvas
    ctx.scale(scale, scale);
    translateX += (cWidth / scale - cropSrcImg.width) / 2;
    translateY += (cHeight / scale - cropSrcImg.height) / 2;
    ctx.drawImage(cropSrcImg, translateX, translateY);

    ctx.restore();

    // Drawing borders
    ctx.globalAlpha = 0.5;

    // Top border
    ctx.fillRect(0, 0, cWidth, (cHeight / 2) - cropMaxSize / 2);
    // Bottom border  
    ctx.fillRect(0, (cHeight / 2) + cropMaxSize / 2,              
                 cWidth, (cHeight / 2) - cropMaxSize / 2);
    // Left border                            
    ctx.fillRect(0, (cHeight / 2) - (cropMaxSize / 2),                       
                 (cWidth - cropMaxSize) / 2, cropMaxSize);     
    // Right border                        
    ctx.fillRect((cWidth / 2) + (cropMaxSize / 2),                           
                 (cHeight / 2) - (cropMaxSize / 2), 
                 (cWidth - cropMaxSize) / 2, cropMaxSize);                             
}

function cropMenuCropImage() {
    const canvas = document.getElementById('crop-image-preview'),
          ctx = canvas.getContext('2d'),
          cWidth = canvas.width,
          cHeight = canvas.height;

    // Get part of the image in the cropped region
    let imageData = ctx.getImageData((cWidth - cropMaxSize) / 2, 
                                     (cHeight / 2) - (cropMaxSize / 2), 
                                     (cWidth - cropMaxSize) / 2 + cropMaxSize, 
                                     (cHeight / 2) + cropMaxSize / 2);

    let buffer = document.createElement('canvas'),
        bufferCtx = buffer.getContext('2d');
    buffer.width = cropMaxSize;
    buffer.height = cropMaxSize;
    bufferCtx.putImageData(imageData, 0, 0);

    // Downscale to 256x256
    let resized = document.createElement('canvas'),
        resizedCtx = resized.getContext('2d');
    resized.width = 256;
    resized.height = 256;
    resizedCtx.drawImage(buffer, 0, 0, buffer.width, buffer.height, 0, 0, 
                         resized.width, resized.height);
    
    // Create a new image file based on the cropped region
    resized.toBlob((blob) => {
        let file = new File([blob], "cropped.png", 
                        {type:"image/png", lastModified:new Date().getTime()});

        let container = new DataTransfer();
        container.items.add(file);
        document.getElementById('add-item-form-image').files = container.files;
    })

    document.getElementById('crop-image-modal').classList.remove('is-active');
    
}

function openCropMenu() {
    document.getElementById('crop-image-modal').classList.toggle('is-active');
    document.getElementById('crop-image-scale-slider').value = 1;
    const imgInForm = document.getElementById('add-item-form-image').files[0],
          cdata = document.getElementById('crop-image-preview').dataset;

    cropSrcImg = new Image();
    cropSrcImg.src = window.URL.createObjectURL(imgInForm);
    cropSrcImg.onload = () => {
        img = cropSrcImg;   
        cdata.translateX = "0";
        cdata.translateY = "0";
        cdata.dragOffsetX = "0";
        cdata.dragOffsetY = "0";

        cropMaxSize = (img.naturalWidth > img.naturalHeight) ? 
                                        img.naturalHeight : img.naturalWidth;

        cropMenuDrawCanvas(1, 0, 0);
    }
}

function cropMenuSetScale(t) {
    const slider = document.getElementById('crop-image-scale-slider'),
          cdata = document.getElementById('crop-image-preview').dataset;
    slider.value = parseFloat(slider.value) + t;
    cropMenuDrawCanvas(parseFloat(slider.value), parseFloat(cdata.translateX), 
                                                 parseFloat(cdata.translateY));
}

// Dragging logic
const cropImagePreview = document.getElementById('crop-image-preview');
cropImagePreview.addEventListener("mousedown", (e) => {
    const cdata = document.getElementById('crop-image-preview').dataset;
    window.isMouseDown = true;
    cdata.dragOffsetX = e.clientX - parseFloat(cdata.translateX);
    cdata.dragOffsetY = e.clientY - parseFloat(cdata.translateY);

});
cropImagePreview.addEventListener("mouseup", () => { 
    window.isMouseDown = false; 
});
cropImagePreview.addEventListener("mouseover", () => { 
    window.isMouseDown = false; 
});
cropImagePreview.addEventListener("mouseout", () => { 
    window.isMouseDown = false; 
});
cropImagePreview.addEventListener("mousemove", (e) => {
    const cdata = document.getElementById('crop-image-preview').dataset,
          slider = document.getElementById("crop-image-scale-slider");

    if (!window.isMouseDown) { return; }

    cdata.translateX = e.clientX - parseFloat(cdata.dragOffsetX);
    cdata.translateY = e.clientY - parseFloat(cdata.dragOffsetY);
    cropMenuDrawCanvas(parseFloat(slider.value), parseFloat(cdata.translateX), 
                                                 parseFloat(cdata.translateY));
    
});
