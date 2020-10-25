let context = new (window.AudioContext || window.webkitAudioContext)();
let speed = 2;
let playing = false;
let currentChar = itukey.charAt(Math.random() * itukey.length);
let morse = toMorse(currentChar);
let attempts = 3;
let correct = 0;
let total = 1;
let init = true;
let learningMode = null;
let artificalDisable = false;
let incorrectMode = false;

function onload() {
  document.getElementById("play").onclick = function() {
    if (init) {
      init = false;
      document.getElementById("letter").style["display"] = "block";
      document.getElementById("learning-mode").disabled = true;
      learningMode = document.getElementById("learning-mode").checked;
      if (!learningMode) {
        document.getElementById("counter").style["display"] = "block";
      }
    }
    player(morse);
    this.innerHTML = "Listen again";
  };

  document.getElementById("letter").value = "";
  document.getElementById("letter").oninput = async function() {
    if (artificalDisable || playing) {
      this.value = this.value.charAt(0);
      return;
    }
    let length = this.value.length;
    let oldChar = this.value.charAt(length - 2);
    this.value = this.value.charAt(length - 1);
    if (length - 2 >= 0 && this.value.charAt(length - 1) == oldChar) {
      return;
    }

    if (this.value.toLowerCase() == currentChar) {
      if (incorrectMode) {
        incorrectMode = false;
        attempts = 3;
        document.getElementById("feedback").innerHTML = "Next!";
        newQuestion();
      }
      else {
        if (!learningMode) {
          correct++;
          total++;
          updateDisplayStats();
          document.getElementById("feedback").innerHTML = "You got it! The answer was " + currentChar.toUpperCase() + ". Next!";
        }
        attempts = 3;
        newQuestion();
      }
    }
    else {
      if (learningMode) {
        document.getElementById("feedback").innerHTML = "Try typing " + currentChar.toUpperCase();
      }
      else {
        attempts--;
        if (attempts <= 0) {
          total++;
          updateDisplayStats();
          document.getElementById("feedback").innerHTML = "Incorrect. Type the answer, " + currentChar.toUpperCase() + ".";
          incorrectMode = true;
        }
        else {
          document.getElementById("feedback").innerHTML = "Try again. (" + attempts.toString() + ")";
        }
      }
    }
  };
}

function updateDisplayStats() {
  document.getElementById("correct").innerHTML = correct;
  document.getElementById("total").innerHTML = total;
}

function newQuestion() {
  currentChar = itukey.charAt(Math.random() * itukey.length);
  morse = toMorse(currentChar);
  player(morse);
}

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
  if (playing) {return;}
  playing = true;
  let visual = document.getElementById("morse-code");
  visual.innerHTML = "<br>";
  let audio = context.createOscillator();
  audio.type = "sine";
  let gainNode = context.createGain();
  gainNode.gain.value = 0.00001;
  audio.connect(gainNode);
  gainNode.connect(context.destination);
  audio.start();
  fadeTime = 0.01;
  for (let i = 0; i < morse.length; i++) {
    if (visual.innerHTML == "<br>") { visual.innerHTML = morse.charAt(i) }
    else { visual.innerHTML += morse.charAt(i); }
    let char = morse.charAt(i);
    if (char == ".") {
      gainNode.gain.setTargetAtTime(0.6, context.currentTime, 0.01);
      await sleep(100/speed);
      gainNode.gain.setTargetAtTime(0, context.currentTime, 0.01);
      await sleep(100/speed);
    }
    if (char == "-") {
      gainNode.gain.setTargetAtTime(0.6, context.currentTime, 0.01);
      await sleep(300/speed);
      gainNode.gain.setTargetAtTime(0, context.currentTime, 0.01);
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
  playing = false;
  if (learningMode) {
    document.getElementById("feedback").innerHTML = "Type " + currentChar.toUpperCase();
  }
}
