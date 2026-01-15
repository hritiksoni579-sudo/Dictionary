const input = document.getElementById("wordInput");
const resultDiv = document.getElementById("result");

// Search on Enter key
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchWord();
    }
});

function searchWord() {
    const word = input.value.trim();

    // Empty input handling
    if (word === "") {
        alert("Please enter a word");
        return;
    }

    resultDiv.innerHTML = "Loading...";

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then(data => {
            displayResult(data);
        })
        .catch(() => {
            resultDiv.innerHTML =
                "<p style='color:red;'>Word not found. Please try another word.</p>";
        });
}

function displayResult(data) {
    const wordData = data[0];
    const meaningData = wordData.meanings[0];
    const definition = meaningData.definitions[0];

    const phonetic = wordData.phonetic || "Not available";
    const partOfSpeech = meaningData.partOfSpeech;
    const meaning = definition.definition;
    const example = definition.example || "Example not available";

    // Audio
    let audioHTML = "Audio not available";
    if (wordData.phonetics[0] && wordData.phonetics[0].audio) {
        audioHTML = `
            <button class="audio-btn" onclick="playAudio('${wordData.phonetics[0].audio}')">
                🔊 Play Audio
            </button>
        `;
    }

    resultDiv.innerHTML = `
        <p><strong>Word:</strong> ${wordData.word}</p>
        <p><strong>Phonetic:</strong> ${phonetic}</p>
        <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
        <p><strong>Meaning:</strong> ${meaning}</p>
        <p><strong>Example:</strong> ${example}</p>
        ${audioHTML}
    `;
}

function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
}
