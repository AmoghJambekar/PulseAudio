document.addEventListener('DOMContentLoaded', function() {
  let audio1 = new Audio();
  audio1.src = "tune.mp3";
  audio1.crossOrigin = "anonymous";
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // for safari browser
  let x = 0; 


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
  analyser.fftSize = 64; 
  const bufferLength = analyser.frequencyBinCount; 
  const dataArray = new Uint8Array(bufferLength); 

  const barWidth = canvas.width / 2 /  bufferLength; 

  const drawVisualizer = ({ bufferLength, dataArray, barWidth }) => {
    let barHeight;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i];
      const hue = (i / bufferLength) * 360;
      const saturation = 100;
      const lightness = 50;

      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.fillRect(
          canvas.width / 2 - x,
          canvas.height - barHeight + 10,
          barWidth,
          barHeight + 3
      );
      x += barWidth;
  }


  for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i];
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

  function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the canvas
    analyser.getByteFrequencyData(dataArray); // copies the frequency data into the dataArray in place. Each item contains a number between 0 and 255
    drawVisualizer({ bufferLength, dataArray, barWidth });
    requestAnimationFrame(animate); // calls the animate function again. This method is built in
  }

    const playPause = document.getElementById("playPause");
    const restartButton = document.getElementById("restart");
    playPause.addEventListener('click', playback);
    let myReq;
    restartButton.addEventListener("click", restart);
    function playback() {
      if (audio1.paused) {
        audio1.play();
        playPause.innerHTML = "⏸️"; // Change to pause icon
        animate();
      } else {
        audio1.pause();
        playPause.innerHTML = "▶️"; // Change to play icon
        cancelAnimationFrame(myReq);
      }
    }
    function restart() {
      audio1.currentTime = 0;
    }

});
