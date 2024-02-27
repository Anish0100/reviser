document.addEventListener('DOMContentLoaded', () => {
    const wordDisplay = document.getElementById('word-display');
    const playBtn = document.getElementById('autoplay');
    const pauseBtn = document.getElementById('pause');
    const restartBtn = document.getElementById('restart');
    const searchInput = document.querySelector('.search-input');

    let wordsAndMeanings;
    let currentWordIndex = 0;
    let autoplayActive = false; // Flag to track autoplay state
    let speechSynthesisInstance = null; // Variable to hold the speech synthesis instance

    // Load words and meanings from JSON file
    fetch('reviser.json')
        .then(response => response.json())
        .then(data => {
            wordsAndMeanings = data;
            // Display the first word on page load
            displayWordAndMeaning(currentWordIndex);
        })
        .catch(error => console.error('Error loading words and meanings:', error));

    playBtn.addEventListener('click', () => {
        // Start or resume autoplay when the play button is clicked
        startOrResumeAutoplay();
    });

    pauseBtn.addEventListener('click', () => {
        // Pause autoplay when the pause button is clicked
        pauseAutoplay();
    });

    restartBtn.addEventListener('click', () => {
        // Reload the page when the restart button is clicked
        window.location.reload();
    });

    // Function to start or resume autoplay
    function startOrResumeAutoplay() {
        // Toggle autoplay state
        autoplayActive = true;
        // Disable the play button and change its color to gray
        playBtn.disabled = true;
        playBtn.style.backgroundColor = 'lightgray';
        // Start autoplay from the current word index if it's paused, otherwise resume from where it left off
        if (!speechSynthesisInstance) {
            speakCurrentWord();
        } else {
            resumeAutoplay();
        }
    }

    // Function to pause autoplay
    function pauseAutoplay() {
        // Toggle autoplay state
        autoplayActive = false;
        // Enable the play button and change its color to blue
        playBtn.disabled = false;
        playBtn.style.backgroundColor = '#007bff';
        // Cancel the current speech synthesis instance if it exists
        if (speechSynthesisInstance) {
            window.speechSynthesis.cancel();
        }
    }

    // Function to resume autoplay
    function resumeAutoplay() {
        // Disable the play button and change its color to gray
        playBtn.disabled = true;
        playBtn.style.backgroundColor = 'lightgray';
        // Continue autoplay from the current word index
        speakCurrentWord();
    }

// Function to speak the current word
function speakCurrentWord() {
    const wordData = wordsAndMeanings[currentWordIndex];
    if (!wordData) {
        // If wordData is undefined, return
        return;
    }
    const { word } = wordData;
    const speech = new SpeechSynthesisUtterance(`${word}`);
    speechSynthesisInstance = speech;

    // Event listener to detect when speech synthesis ends
    speech.onend = () => {
        // If autoplay is active, continue to the next word after 5 seconds
        if (autoplayActive && currentWordIndex < wordsAndMeanings.length - 1) {
            setTimeout(() => {
                currentWordIndex++;
                displayWordAndMeaning(currentWordIndex);
                speakCurrentWord(); // Speak the next word
            }, 600); 
        } else if (!autoplayActive) {
            // If autoplay is not active, reset the speech synthesis instance
            speechSynthesisInstance = null;
        }
    };

    window.speechSynthesis.speak(speech);
}


   // Function to display the word and meaning
   function displayWordAndMeaning(index) {
    const wordData = wordsAndMeanings[index];
    if (wordData) {
        const { word, meaning } = wordData;
        wordDisplay.innerText = word;
        // meaningDisplay.innerText = meaning;
    }
}

// Event listener for the search input
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior of the Enter key
        const searchTerm = searchInput.value.trim().toLowerCase();
        const searchResultIndex = findWordIndex(searchTerm);
        if (searchResultIndex !== -1) {
            // If the word is found, display the word and meaning
            currentWordIndex = searchResultIndex;
            pauseAutoplay(); // Pause autoplay
            displayWordAndMeaning(currentWordIndex); // Display the word and meaning
            speakCurrentWord(); // Speak the word
        } else {
            // If the word is not found, display an alert or handle it accordingly
            alert('Word not found');
        }
        // Clear the search input after searching
        searchInput.value = '';
    }
});


// Function to find the index of a word in the JSON data
function findWordIndex(word) {
    return wordsAndMeanings.findIndex(item => item.word.toLowerCase() === word);
}
});
