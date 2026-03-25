    const IMAGE_DATA = {
      0: {
        prediction: 'potted plant, sports ball',
        afterPrediction: 'potted plant, potted plant',
        iou: '0.9664263655403534',
      },
      1: {
        prediction: 'apple, apple, apple, banana, banana, ..., potted plant',
        afterPrediction: 'apple,banana, banana, ..., potted plant',
        iou: '0.9119255082863489',
      },
      2: {
        prediction: 'person, person',
        afterPrediction: '\' \'',
        iou: '0.9669914212393814',
      },
      3: {
        prediction: 'bottle, chair, chair, dining table',
        afterPrediction: 'chair, chair, dining table, kite',
        prediction1: 'bottle, chair, chair, dining table',
        iou: '0.958481422457723',
      },
      4: {
        prediction: 'potted plant',
        afterPrediction: '\' \'',
        prediction1: 'potted plant',
        iou: '0.96605427977946',
      },
    };

    const slides = document.getElementById("slides");
    let currentIndex = 0;
    let currentKey = 0;

    function createSlide(imgPath, stage, prediction, iou = null, prediction1 = null) {
      let predictionHTML = `<p class="card-text"><small class="text-muted">${prediction}</small></p>`;
      if (currentKey === 3 && prediction1) {
        predictionHTML = `
          <p class="card-text"><small class="text-muted">Mask 1: ${prediction}</small></p><br/>
          <p class="card-text"><small class="text-muted">Mask 2: ${prediction1}</small></p>
        `;
      } else if (currentKey === 4 && prediction1) {
        predictionHTML = `
          <p class="card-text"><small class="text-muted">Mask 1: ${prediction}</small></p><br/>
          <p class="card-text"><small class="text-muted">Mask 2: ${prediction1}</small></p><br/>
          <p class="card-text"><small class="text-muted">Mask 3: ${prediction1}</small></p><br/>
          <p class="card-text"><small class="text-muted">Mask 4: ${prediction1}</small></p>
        `;
      } else if (iou && prediction1 && currentKey !== 3 && currentKey !== 4) {
        predictionHTML = `
          <p class="card-text"><small class="text-muted">${prediction}</small></p><br/>
          <p class="card-text"><small class="text-muted">${prediction1}</small></p>
        `;
      }

      const iouHTML = iou
        ? `<div class="card-title"><b>IOU :</b> <small class="text-muted">${iou}</small></div>`
        : '';

      return `
        <div class="slide">
          <img src="${imgPath}" alt="${stage} Image" />
          <div class="card">
            <div class="card-header">Stage: ${stage}</div>
            <div class="card-body">
              <div class="card-title"><b>Object Detected</b></div>
              ${predictionHTML}
              ${iouHTML}
            </div>
          </div>
        </div>
      `;
    }

    function updateSlideContent() {
      const data = IMAGE_DATA[currentKey];
      slides.innerHTML = "";

      slides.innerHTML += createSlide(`demos/canny/${currentKey}.jpg`, "Benign", data.prediction);
      slides.innerHTML += createSlide(`demos/canny/Detect/${currentKey}.jpg`, "Detection", data.prediction);
      slides.innerHTML += createSlide(`demos/canny/Mask/${currentKey}.jpg`, "Mask", data.prediction);
      slides.innerHTML += createSlide(`demos/canny/Mitigation/${currentKey === 3 || currentKey === 4 ? `${currentKey}.1` : currentKey}.jpg`, "Mitigation", data.prediction);
      slides.innerHTML += createSlide(`demos/canny/After_mitigation/${currentKey === 3 || currentKey === 4 ? `${currentKey}.1` : currentKey}.jpg`, "After Mitigation", data.afterPrediction, data.iou, data.prediction1);

      updateSlide();
    }

    function nextSlide() {
      if (currentIndex < 4) {
        currentIndex++;
        updateSlide();
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlide();
      }
    }

    function updateSlide() {
      const slideWidth = slides.parentElement.offsetWidth;
      slides.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    function changeKey() {
      currentKey = parseInt(document.getElementById("keySelect").value);
      currentIndex = 0;
      updateSlideContent();
    }

window.onload = updateSlideContent;

// Handle window resize for responsive carousel
window.addEventListener('resize', function() {
    updateSlide();
});
