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
logoPreloader.src = 'li-overlay.png';

function imageLoadTracker(src, onload) {
  var img = new Image();
  img.addEventListener('load', onload, false);
  img.src = src;
  return img;
}

function fillTextCircle(ctx, text, x, y, radius, startRotation) {
   var numRadsPerLetter = 0.5 * Math.PI / text.length;
   ctx.save();
   ctx.translate(x,y);
   ctx.rotate(startRotation);

   for(var i=0;i<text.length;i++){
      ctx.save();
      ctx.rotate(i*numRadsPerLetter);

      ctx.fillText(text[i],0,-radius);
      ctx.restore();
   }
   ctx.restore();
}

function loadOnCanvas(file) {
  return function(e) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.reset()
    ctx.globalAlpha = 1.0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var imagesLoaded = 0;
    var imageProcess = function() {
      imagesLoaded += 1;
      if (imagesLoaded == 2) {
        var height = baseImg.height, width = baseImg.width;
        var newWidth, newHeight, scale;
        if (width < height) {
          scale = width / 1024;
          newWidth = 1024;
          newHeight = height / scale;
        } else {
          scale = height / 1024;
          newHeight = 1024;
          newWidth = width / scale;
        }
        ctx.drawImage(baseImg, canvas.width / 2 - newWidth / 2,
          canvas.height / 2 - newHeight / 2, newWidth, newHeight);
        var imageData = ctx.getImageData(0, 0, 1024, 1024);
        var data = imageData.data;

        // for(var i = 0; i < data.length; i += 4) {
        //   var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        //   data[i] = brightness;
        //   data[i + 1] = brightness;
        //   data[i + 2] = brightness;
        // }
        // ctx.putImageData(imageData, 0, 0);
        // ctx.globalAlpha = 0.7;

        ctx.globalCompositeOperation='destination-in';
        ctx.beginPath();
        ctx.arc(newWidth / 2, newHeight / 2, newHeight / 2, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();

        ctx.globalCompositeOperation='source-over';
        ctx.drawImage(overlayImage, 0, 0);

        // ctx.font = "bold 30px";
        // fillTextCircle(ctx, "Circle Text ", 0, 800 / 2, 800 / 2, Math.PI / 2);

        document.getElementById('download-btn').style.display = 'inline';
      }
    }
    var baseImg = imageLoadTracker(e.target.result, imageProcess);
    var overlayImage = imageLoadTracker('li-overlay.png', imageProcess);
  }
}

function downloadPic() {
  var dataURL = document.getElementById('canvas').toDataURL('image/png');
  document.getElementById('download-btn').href = dataURL;
}

document.getElementById('select-photo').addEventListener('click', openFileDialog, false);
document.getElementById('fileElem').addEventListener('change', loadPicture, false);
document.getElementById('download-btn').addEventListener('click', downloadPic, false);

var samplePreloader = new Image();
samplePreloader.src = 'kirti.jpg';
samplePreloader.addEventListener('load', function() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.drawImage(samplePreloader, 0, 0);
}, false);
