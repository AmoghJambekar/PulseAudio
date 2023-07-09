document.addEventListener('DOMContentLoaded', function() {
  let audio1 = new Audio();
  const selectAudioButton = document.getElementById('selectAudioButton');
  const audioFileInput = document.getElementById('audioFileInput');

  audioFileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const fileURL = URL.createObjectURL(file);
    audio1.src = fileURL;
  });
  
  audio1.crossOrigin = "anonymous";
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // for safari browser
  let x = 0;
  let visualizationType = "bars";

  const container = document.getElementById("container");
  const canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d");

  let audioSource = null;
  let analyser = null;

  audioSource = audioCtx.createMediaElementSource(audio1); 
  analyser = audioCtx.createAnalyser(); 
  audioSource.connect(analyser); 
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 256; 
  const bufferLength = analyser.frequencyBinCount; 
  const dataArray = new Uint8Array(bufferLength); 

  const barWidth = canvas.width / 2 /  bufferLength; 

// Function to draw a circle
  function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }


// Function to visualize the music as circles
function drawCircleVisualizer({ bufferLength, dataArray, barWidth }) {
  let barHeight;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 2;
    const hue = (i / bufferLength) * 360;
    const saturation = 100;
    const lightness = 50;

    const centerX = canvas.width / 2 - x + barWidth / 2;
    const centerY = canvas.height - barHeight + barHeight / 2;
    const radius = barHeight / 2;
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    drawCircle(centerX, centerY, radius, color);

    x += barWidth;
  }
  
}

// Function to visualize the music as bars
function drawBarVisualizer({ bufferLength, dataArray, barWidth }) {
  let barHeight;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 2;
    const hue = (i / bufferLength) * 360;
    const saturation = 100;
    const lightness = 50;

    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    ctx.fillRect(
        canvas.width / 2 - x,
        canvas.height - barHeight,
        barWidth,
        barHeight
    );
    x += barWidth;
}


for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 2;
    const hue = (i / bufferLength) * 360;
    const saturation = 100;
    const lightness = 50;

    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    ctx.fillRect(
        x,
        canvas.height - barHeight,
        barWidth,
        barHeight
    );
    x += barWidth;
  }
}


  function animate(type) {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the canvas
    analyser.getByteFrequencyData(dataArray); // copies the frequency data into the dataArray in place. Each item contains a number between 0 and 255
    if (type = "bars") {
      drawBarVisualizer({ bufferLength, dataArray, barWidth });
      myReq = requestAnimationFrame(() => animate("bars"));
    }
    else {
      drawCircleVisualizer({ bufferLength, dataArray, barWidth });
      myReq = requestAnimationFrame(() => animate("circles"));
    }
  }

    const playPause = document.getElementById("playPause");
    const restartButton = document.getElementById("restart");
    const visualizeButton = document.getElementById("visualizationToggle");
    playPause.addEventListener('click', playback);
    restartButton.addEventListener('click', restart);
    visualizeButton.addEventListener('click',toVisualise);
    let myReq;
    function playback() {
      if (audio1.paused) {
        audio1.play();
        playPause.innerHTML = "⏸"; // Change to pause icon
        animate(visualizationType);
      } else {
        audio1.pause();
        playPause.innerHTML = "▶"; // Change to play icon
        cancelAnimationFrame(myReq);
      }
    }
    function restart() {
      audio1.currentTime = 0;
      animate();
    }

    function toVisualise() {
      if (visualizationType === "circles") {
        visualizationType = "bars";
        visualizeButton.innerHTML = "📊"; // Change to bars emoji
        restart();
      } else {
        visualizationType = "circles";
        visualizeButton.innerHTML = "🥧"; // Change to circles emoji
        restart();
    }
  }
});
