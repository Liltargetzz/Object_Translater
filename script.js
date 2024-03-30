const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');
var lang = 1;
var sound

function playSound(id) {
  if (document.getElementById(id)) {
    if (sound) {
      sound.pause()
    }
    setTimeout(function() {
      sound = document.getElementById(id);
      sound.currentTime = 0;
      sound.play();
    }, 1);

  }
}


function selector() {
  var e = document.getElementById("language");
  var value = e.options[e.selectedIndex].value;
  var text = e.options[e.selectedIndex].text;

  if (value == "Spanish") {
    lang = 1;
  }

  if (value == "Mandarin") {
    lang = 2;
  }

  if (value == "Hindi") {
    lang = 3;
  }

  if (value == "German") {
    lang = 4;
  }

  if (value == "Arabic") {
    lang = 5;
  }

  if (value == "Hebrew") {
    lang = 6;
  }

  if (value == "French") {
    lang = 7;
  }

  if (value == "Russian") {
    lang = 8;
  }
}



// Check if webcam access is supported.
function getUserMediaSupported() {
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it to call enableCam function which we will 
// define in the next step.
if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener('click', enableCam);
} else {
  console.warn('getUserMedia() is not supported by your browser');
}

// Placeholder function for next step. Paste over this in the next step.
function enableCam(event) {
  // Only continue if the COCO-SSD has finished loading.
  if (!model) {
    return;
  }

  // Hide the button once clicked.
  event.target.classList.add('removed');

  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: true
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    video.srcObject = stream;
    video.addEventListener('loadeddata', predictWebcam);
  });
}

// Store the resulting model in the global scope of our app.
var model = undefined;

// Before we can use COCO-SSD class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment 
// to get everything needed to run.
// Note: cocoSsd is an external object loaded from our index.html
// script tag import so ignore any warning in Glitch.
cocoSsd.load().then(function(loadedModel) {
  model = loadedModel;
  // Show demo section now model is ready to use.
  demosSection.classList.remove('invisible');
});

var children = [];

function predictWebcam() {
  // Now let's start classifying a frame in the stream.
  model.detect(video).then(function(predictions) {
    // Remove any highlighting we did previous frame.
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);

    // Now lets loop through predictions and draw them to the live view if
    // they have a high confidence score.
    for (let n = 0; n < predictions.length; n++) {
      // If we are over 66% sure we are sure we classified it right, draw it!
      if (predictions[n].score > 0.66) {
        const p = document.createElement('p');
        p.innerText = predictions[n].class + ' - with '
          + Math.round(parseFloat(predictions[n].score) * 100)
          + '% confidence.';
        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
          + (predictions[n].bbox[1] - 10) + 'px; width: '
          + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
          + predictions[n].bbox[1] + 'px; width: '
          + predictions[n].bbox[2] + 'px; height: '
          + predictions[n].bbox[3] + 'px;';

        liveView.appendChild(highlighter);
        liveView.appendChild(p);
        children.push(highlighter);
        children.push(p);

        console.log(predictions[n].class);
        document.getElementById("p1").innerHTML = predictions[n].class;

        if (predictions[n].class == "person" && lang == "1") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - persona";
          document.getElementById('hear').setAttribute("onClick", 'playSound("1es")');
        }

        if (predictions[n].class == "person" && lang == "2") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - 人(Rén)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("1cn")');
        }

        if (predictions[n].class == "person" && lang == "3") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - व्यक्ति(vyakti)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("1hi")');
        }

        if (predictions[n].class == "person" && lang == "4") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - Person";
          document.getElementById('hear').setAttribute("onClick", 'playSound("1de")');
        }

        if (predictions[n].class == "person" && lang == "5") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - شخص(shakhs)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("1ar")');
        }

        if (predictions[n].class == "person" && lang == "6") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - אדם(Adam)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("1iw")');
        }

        if (predictions[n].class == "person" && lang == "7") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - personne";
          document.getElementById('hear').setAttribute("onClick", 'playSound("1fr")');
        }

        if (predictions[n].class == "person" && lang == "8") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - человек(chelovek)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("1ru")');
        }

        if (predictions[n].class == "cell phone" && lang == "1") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - el teléfono celular";
          document.getElementById('hear').setAttribute("onClick", 'playSound("2es")');
        }

        if (predictions[n].class == "cell phone" && lang == "2") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - 手机(Shǒujī)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("2cn")');
        }

        if (predictions[n].class == "cell phone" && lang == "3") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - सेलफोन(selaphon)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("2hi")');
        }

        if (predictions[n].class == "cell phone" && lang == "4") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - Handy";
          document.getElementById('hear').setAttribute("onClick", 'playSound("2de")');
        }

        if (predictions[n].class == "cell phone" && lang == "5") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - الهاتف الخلوي(alhatif alkhalawiu)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("2ar")');
        }

        if (predictions[n].class == "cell phone" && lang == "6") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - טלפון נייד";
          document.getElementById('hear').setAttribute("onClick", 'playSound("2iw")');
        }

        if (predictions[n].class == "cell phone" && lang == "7") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - téléphone portable";
          document.getElementById('hear').setAttribute("onClick", 'playSound("2fr")');
        }

        if (predictions[n].class == "cell phone" && lang == "8") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - сотовый телефон(sotovyy telefon)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("2ru")');
        }

        if (predictions[n].class == "microwave" && lang == "1") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - microonda";
          document.getElementById('hear').setAttribute("onClick", 'playSound("3es")');
        }

        if (predictions[n].class == "microwave" && lang == "2") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - 微波(Wéibō)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("3cn")');
        }

        if (predictions[n].class == "microwave" && lang == "3") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - माइक्रोवेव(maikrovev)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("3hi")');
        }

        if (predictions[n].class == "microwave" && lang == "4") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - Mikrowelle";
          document.getElementById('hear').setAttribute("onClick", 'playSound("3de")');
        }

        if (predictions[n].class == "microwave" && lang == "5") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - الميكروويف(almaykruwif)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("3ar")');
        }

        if (predictions[n].class == "microwave" && lang == "6") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - מיקרוגל";
          document.getElementById('hear').setAttribute("onClick", 'playSound("3iw")');
        }

        if (predictions[n].class == "microwave" && lang == "7") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - four micro onde";
          document.getElementById('hear').setAttribute("onClick", 'playSound("3fr")');
        }

        if (predictions[n].class == "microwave" && lang == "8") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - микроволновка(mikrovolnovka)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("3ru")');
        }

        if (predictions[n].class == "apple" && lang == "1") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - manzana";
          document.getElementById('hear').setAttribute("onClick", 'playSound("4es")');
        }

        if (predictions[n].class == "apple" && lang == "2") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - 苹果(Píngguǒ)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("4cn")');
        }

        if (predictions[n].class == "apple" && lang == "3") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - सेब(seb)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("4hi")');
        }

        if (predictions[n].class == "apple" && lang == "4") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - Apfel";
          document.getElementById('hear').setAttribute("onClick", 'playSound("4de")');
        }

        if (predictions[n].class == "apple" && lang == "5") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - تفاحة(tufaahatan)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("4ar")');
        }

        if (predictions[n].class == "apple" && lang == "6") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - תפוח עץ";
          document.getElementById('hear').setAttribute("onClick", 'playSound("4iw")');
        }

        if (predictions[n].class == "apple" && lang == "7") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - pomme";
          document.getElementById('hear').setAttribute("onClick", 'playSound("4fr")');
        }

        if (predictions[n].class == "apple" && lang == "8") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - яблоко(yabloko)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("4ru")');
        }

        if (predictions[n].class == "banana" && lang == "1") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - plátano";
          document.getElementById('hear').setAttribute("onClick", 'playSound("5es")');
        }

        if (predictions[n].class == "banana" && lang == "2") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - 香蕉(Xiāngjiāo)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("5cn")');
        }

        if (predictions[n].class == "banana" && lang == "3") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - केला(kela)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("5hi")');
        }

        if (predictions[n].class == "banana" && lang == "4") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - Banane";
          document.getElementById('hear').setAttribute("onClick", 'playSound("5de")');
        }

        if (predictions[n].class == "banana" && lang == "5") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - موز(mawz)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("5ar")');
        }

        if (predictions[n].class == "banana" && lang == "6") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - בננה";
          document.getElementById('hear').setAttribute("onClick", 'playSound("5iw")');
        }

        if (predictions[n].class == "banana" && lang == "7") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - banane";
          document.getElementById('hear').setAttribute("onClick", 'playSound("5fr")');
        }

        if (predictions[n].class == "banana" && lang == "8") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - банан(banan)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("5ru")');
        }

        if (predictions[n].class == "scissors" && lang == "1") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - tijeras";
          document.getElementById('hear').setAttribute("onClick", 'playSound("6es")');
        }

        if (predictions[n].class == "scissors" && lang == "2") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - 剪刀(Jiǎndāo)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("6cn")');
        }

        if (predictions[n].class == "scissors" && lang == "3") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - कैंची(kainchee)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("6hi")');
        }

        if (predictions[n].class == "scissors" && lang == "4") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - Schere";
          document.getElementById('hear').setAttribute("onClick", 'playSound("6de")');
        }

        if (predictions[n].class == "scissors" && lang == "5") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - مقص(muqasun)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("6ar")');
        }

        if (predictions[n].class == "scissors" && lang == "6") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - מספריים";
          document.getElementById('hear').setAttribute("onClick", 'playSound("6iw")');
        }

        if (predictions[n].class == "scissors" && lang == "7") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - ciseaux";
          document.getElementById('hear').setAttribute("onClick", 'playSound("6fr")');
        }

        if (predictions[n].class == "scissors" && lang == "8") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - ножницы(nozhnitsy)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("6ru")');
        }

        if (predictions[n].class == "clock" && lang == "1") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - reloj";
          document.getElementById('hear').setAttribute("onClick", 'playSound("7es")');
        }

        if (predictions[n].class == "clock" && lang == "2") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - 时钟(Shízhōng)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("7cn")');
        }

        if (predictions[n].class == "clock" && lang == "3") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - घड़ी(ghadee)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("7hi")');
        }

        if (predictions[n].class == "clock" && lang == "4") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - Uhr";
          document.getElementById('hear').setAttribute("onClick", 'playSound("7de")');
        }

        if (predictions[n].class == "clock" && lang == "5") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - ساعة(saea)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("7ar")');
        }

        if (predictions[n].class == "clock" && lang == "6") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - שָׁעוֹן";
          document.getElementById('hear').setAttribute("onClick", 'playSound("7iw")');
        }

        if (predictions[n].class == "clock" && lang == "7") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - horloge";
          document.getElementById('hear').setAttribute("onClick", 'playSound("7fr")');
        }

        if (predictions[n].class == "clock" && lang == "8") {
          document.getElementById("p1").innerHTML = predictions[n].class + " - Часы(Chasy)";
          document.getElementById('hear').setAttribute("onClick", 'playSound("7ru")');
        }


      }
    }
    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  });

}