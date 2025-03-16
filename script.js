const synth = window.speechSynthesis;
const textInput = document.getElementById("textInput");
const voiceSelect = document.getElementById("voiceSelect");
const speedControl = document.getElementById("speedControl");
const pitchControl = document.getElementById("pitchControl"); // اصلاح شد!
const speakBtn = document.getElementById("speakBtn");
const resumeBtn = document.getElementById("resumeBtn");
const pauseBtn = document.getElementById("pauseBtn");
const highlightedText = document.getElementById("highlightedText");

let utterance; 

function loadVoices() {
    const voices = synth.getVoices();
    voiceSelect.innerHTML = voices.map(voice => 
        `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`
    ).join("");

   
    if (localStorage.getItem("voice")) {
        voiceSelect.value = localStorage.getItem("voice");
    }
}

function speakText() {
    if (!textInput.value.trim()) {
        alert("Please type something...");
        return;
    }

    if (synth.speaking) {
        synth.cancel();
    }

    utterance = new SpeechSynthesisUtterance(textInput.value);
    const selectedVoice = voiceSelect.value;
    utterance.voice = synth.getVoices().find(voice => voice.name === selectedVoice);
    utterance.rate = speedControl.value;
    utterance.pitch = pitchControl.value; 

    utterance.onboundary = function (event) {
        let words = textInput.value.split(" ");
        let charIndex = event.charIndex;

        let currentWordIndex = 0;
        let charCount = 0;

        for (let i = 0; i < words.length; i++) {
            charCount += words[i].length + 1; 
            if (charIndex < charCount) {
                currentWordIndex = i;
                break;
            }
        }

        let highlightedTextContent = words.map((word, i) =>
            i === currentWordIndex ? `<span style="background: yellow">${word}</span>` : word
        ).join(" ");

        highlightedText.innerHTML = highlightedTextContent;
    };

    synth.speak(utterance);
}


voiceSelect.addEventListener("change", () => localStorage.setItem("voice", voiceSelect.value));
speedControl.addEventListener("input", () => localStorage.setItem("speed", speedControl.value));
pitchControl.addEventListener("input", () => localStorage.setItem("pitch", pitchControl.value));


function loadSettings() {
    if (localStorage.getItem("speed")) speedControl.value = localStorage.getItem("speed");
    if (localStorage.getItem("pitch")) pitchControl.value = localStorage.getItem("pitch");
}

speakBtn.addEventListener("click", speakText);
pauseBtn.addEventListener("click", () => synth.pause());
resumeBtn.addEventListener("click", () => synth.resume());

speechSynthesis.onvoiceschanged = loadVoices;
window.onload = function () {
    loadVoices();
    loadSettings();
};
