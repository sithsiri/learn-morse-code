let context = new (window.AudioContext || window.webkitAudioContext)();
let speed = 2;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toMorse(characters) {
  let morse = "";
  for (let i = 0; i < characters.length; i++) {
    ituIndex = itukey.indexOf(characters.charAt(i));
    if (ituIndex > -1) {
      morse = morse + itu[ituIndex] + " ";
    }
    else if (characters.charAt(i) == " ") {
      morse = morse + "/ ";
    }
  }
  return morse;
}

async function player(morse) {
  let audio = context.createOscillator();
  audio.type = "sine";
  let gainNode = context.createGain();
  gainNode.gain.value = 0.00001;
  audio.connect(gainNode);
  gainNode.connect(context.destination);
  audio.start();
  fadeTime = 0.02;
  for (let i = 0; i < morse.length; i++) {
    let char = morse.charAt(i);
    if (char == ".") {
      gainNode.gain.linearRampToValueAtTime(0.6, context.currentTime + fadeTime);
      await sleep(100/speed);
      gainNode.gain.linearRampToValueAtTime(0.00001, context.currentTime + fadeTime);
      await sleep(100/speed);
    }
    if (char == "-") {
      gainNode.gain.linearRampToValueAtTime(0.6, context.currentTime + fadeTime);
      await sleep(300/speed);
      gainNode.gain.linearRampToValueAtTime(0.00001, context.currentTime + fadeTime);
      await sleep(100/speed);
    }
    if (char == " ") {
      await sleep(300/speed);
    }
    if (char == "/") {
      await sleep(300/speed);
    }
  }
  audio.stop();
}

let morse = toMorse("allegory bean");
console.log(morse);
document.getElementById("play").onclick = function() {player(morse)};
