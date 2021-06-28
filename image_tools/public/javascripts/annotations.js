var previousAnnotations;

currentAnnotations().then(function(annotations) {
  annotations.forEach(function(annotation){
    renderAnnotationBox(annotation.content);
  });
  getNewAnnotations([]);
});

function currentAnnotations() {
  return fetch('http://localhost:3000/regions').then(function(request) {
    return request.json();
  }).then(function(annotations) {
    return annotations;
  });
}

function annoDiff(a1, a2) {
  return a1.filter((annotation) => {
    var match;
    a2.forEach(anno => {
      if (anno.id === annotation.id) {
        match = true;
      }
    });

    return !match;
  });
}

function getNewAnnotations(previousAnnotations) {

  console.log('fetching new ones');
  setTimeout(function(){
    currentAnnotations().then(function(annotations) {
      annoDiff(annotations, previousAnnotations).forEach(annotation => {

      });
      getNewAnnotations(annotations);
    });

  }, 2000);
}

function drawThumbsToCanvas(canvas, images) {
  var leftPosition = 0,
      topPosition = 0,
      canvasWidth = images.reduce(function(sum, image) {
        return sum + image.width;
      }, 0),
      canvasHeight = images.reduce(function(sum, image) {
        return sum + image.height;
      }, 0);

  canvas.width = canvasWidth/10;
  canvas.height = canvasHeight/10;

  var context = canvas.getContext('2d');
  images.forEach(function(image) {
    context.drawImage(image, leftPosition, topPosition);
    if (leftPosition > canvas.width) {
      leftPosition = 0;
      topPosition += image.height;
    } else {
      leftPosition += image.width;
    }
  });
}

function getCanvasThumbImage(canvas, index, total) {
  return promisifyImage(canvas.thumbnail['@id']);
}

function drawSourceToRegionLines(canvas, regionBox, excerpt) {
  var sourceX1 = regionBox.offsetLeft + regionBox.offsetWidth,
      sourceY1 = regionBox.offsetTop,
      targetX1 = excerpt.offsetLeft,
      targetY1 = excerpt.offsetTop,
      sourceX2 = regionBox.offsetLeft + regionBox.offsetWidth,
      sourceY2 = regionBox.offsetTop + regionBox.offsetHeight,
      targetX2 = excerpt.offsetLeft,
      targetY2 = excerpt.offsetTop + excerpt.offsetHeight;

  var context = canvas.getContext('2d');
  // Reset the current path
  context.lineWidth = 2;
  context.strokeStyle = 'deepSkyBlue';
  context.beginPath();
  context.moveTo(
    sourceX1,
    sourceY1
  );
  context.lineTo(
    targetX1,
    targetY1
  );
  context.stroke();
  context.moveTo(
    sourceX2,
    sourceY2
  );
  context.lineTo(
    targetX2,
    targetY2
  );
  context.stroke();
}

function fetchAnnotationManifest(annotation) {
  return fetch(annotation.on[0].within['@id']).then(function(request) {
    return request.json();
  });
}

console.log(fetchAnnotationManifest());

function getCanvasJSONFromAnnotation(annotation, manifest) {
  return manifest.sequences[0].canvases.filter(function(canvas) {
    return canvas['@id'] === annotation.on.full;
  })[0];
}

function resizeAnnotationRegion(region, canvas, targetWidth) {
  var scaleFactor = targetWidth/canvas.width;
  return {
    x: region.x * scaleFactor,
    y: region.y * scaleFactor,
    width: region.width * scaleFactor,
    height: region.height * scaleFactor
  };
}

function scaleBoxToWidth(box, width) {
  var scaleFactor = width/box.width;

  return {
    x: box.x * scaleFactor,
    y: box.y,
    width: box.width * scaleFactor,
    height: box.height * scaleFactor
  };
}

function getAnnoCanvasImage(annotation) {
  var canvasId = annotation.on.full;
  return canvasId.substring(0, canvasId.lastIndexOf("/")) +
    '/full/100,/0/native.jpg';

  // for real spec compatibility, we might
  // want to grab the manifest and then get
  // the thumbnail. Otherwise, dereference
  // the canvas (if possible), and use its
  // thumbnail. Otherwise, suggest an addition
  // to the spec to include a thumbnail in the
  // annotation JSON-LD itself. Or at least make
  // that valid.
}

function getAnnoRegionImage(annotation) {
  var canvasId = annotation.on[0].full,
  fragment = annotation.on[0].selector.default.value,
  dimensions = getDimensionsFromFragment(fragment),
  x = dimensions.x + ',',
  y = dimensions.y + ',',
  width = dimensions.width + ',',
  height = dimensions.height;

  return canvasId.substring(0, canvasId.lastIndexOf("/")) +
    '/' + x + y + width + height + '/300,/0/native.jpg';
}

function promisifyImage(src) {
  var image = new Image();
  var imagePromise = new Promise((resolve, reject) => {
    image.onload = function() {
      resolve(image);
    };

    image.src = src;
  });

  return imagePromise;
}

function getDimensionsFromFragment(fragment) {
  var regionArray = fragment.substring(
    fragment.indexOf("=") + 1,
    fragment.length + 1
  ).split(',');

  return {
    x: parseInt(regionArray[0]),
    y: parseInt(regionArray[1]),
    width: parseInt(regionArray[2]),
    height: parseInt(regionArray[3])
  };
}

function extractJSON_LD(IA_annotation) {
  return IA_annotation.annotation;
}

function createElement(DOMString) {
  var container = document.createElement('div');
  container.innerHTML = DOMString;
  return container;
}

function renderCrosslink(annotation) {
  var mutualAnnotation,
  source1Manifest,
  source1Image,
  target1Image,
  source2Manifest,
  source2Image,
  target2Image;

  source1Manifest = fetchAnnotationManifest(annotation);
  mutualAnnotation = fetchCrossLink(annotation);
  source2Manifest = mutualAnnotation.then(function(crossLink) {
    return fetchAnnotationManifest(crossLink.annotation);
  });
  source1Image = source1Manifest.then(function(manifest) {
    return promisifyImage(getAnnoCanvasImage(annotation));
  });
  source2Image = mutualAnnotation.then(function(crossLink) {
    return source2Manifest.then(function(manifest) {
      return promisifyImage(getAnnoCanvasImage(crossLink.annotation));
    });
  });
  target1Image = source1Manifest.then(function(manifest) {
    return promisifyImage(getAnnoRegionImage(annotation));
  });
  target2Image = mutualAnnotation.then(function(crossLink) {
    return source2Manifest.then(function(manifest) {
      return promisifyImage(getAnnoRegionImage(crossLink.annotation));
    });
  });

  // When all remote resources have been retrieved, then
  // render the crosslinks.
  Promise.all([
    mutualAnnotation,
    source1Manifest,
    source1Image,
    target1Image,
    source2Manifest,
    source2Image,
    target2Image
  ]).then((result) => {
  });
}

function renderAnnotationBox(annotationData) {
  var canvas = document.getElementById('viewer');

  var annotationContainer = createElement();
  var annotationBody = createElement(annotationData.resource[0].chars);
  annotationContainer.prepend(annotationBody);

  if (annotationData.on[0].selector.default) {
    promisifyImage(getAnnoRegionImage(annotationData))
      .then(image => {
        var body = annotationContainer.prepend(image);
      });
  }

  // Create an image link for the annotation
  var body = document.getElementsByTagName('body')[0]
      .prepend(annotationContainer);
}

function renderContextDiagram(annotationData) {
}

function renderCrosslinkAsImage(annotationData) {
}

function renderAnnotationAsImage(annotation, index, array) {
}
