function click(elem) {
  var evt = document.createEvent('Event');
  evt.initEvent('click', true, true);
  elem.dispatchEvent(evt);
}

function openFileDialog() {
  var fileElem = document.getElementById('fileElem');
  fileElem.click();
}

function loadPicture(evt) {
  var file = evt.target.files[0];
  if (!file.type.match('image.*')) {
    alert("Oops! Looks like you didn't select an image?");
  } else {
    var reader = new FileReader();
    reader.addEventListener('load', loadOnCanvas(file), false);
    reader.readAsDataURL(file);
  }
}

var logoPreloader = new Image();
logoPreloader.src = 'logo.png';

function imageLoadTracker(src, onload) {
  var img = new Image();
  img.addEventListener('load', onload, false);
  img.src = src;
  return img;
}

function loadOnCanvas(file) {
  return function(e) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1.0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var imagesLoaded = 0;
    var imageProcess = function() {
      imagesLoaded += 1;
      if (imagesLoaded == 2) {
        var height = baseImg.height, width = baseImg.width;
        var newWidth, newHeight, scale;
        if (width < height) {
          scale = width / 800;
          newWidth = 800;
          newHeight = height / scale;
        } else {
          scale = height / 800;
          newHeight = 800;
          newWidth = width / scale;
        }
        ctx.drawImage(baseImg, canvas.width / 2 - newWidth / 2,
          canvas.height / 2 - newHeight / 2, newWidth, newHeight);
        ctx.globalAlpha = 0.7;
        ctx.drawImage(overlayImage, 0, 0);
        canvas.style.display = 'inline';
        document.getElementById('download-btn').style.display = 'inline';
      }
    }
    var baseImg = imageLoadTracker(e.target.result, imageProcess);
    var overlayImage = imageLoadTracker('logo.png', imageProcess);
  }
}

function downloadPic(e) {
  var dataURL = document.getElementById('canvas').toDataURL('image/png');
  e.target.href = dataURL;
}

document.getElementById('select-photo').addEventListener('click', openFileDialog, false);
document.getElementById('fileElem').addEventListener('change', loadPicture, false);
document.getElementById('download-btn').addEventListener('click', downloadPic, false);
