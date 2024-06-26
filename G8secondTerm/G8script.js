document.addEventListener('DOMContentLoaded', () => {
    const wordDisplay = document.getElementById('word-display');
    const restartBtn = document.getElementById('restart')
    const meaningDisplay = document.getElementById('meaning-display');
    const playBtn = document.getElementById('autoplay');
    const pronounceBtn = document.getElementById('pronounce');
    const pauseBtn = document.getElementById('pause');
    const searchInput = document.querySelector('.search-input');
    const prevBtn = document.getElementById('prev_btn');
    const nextBtn = document.getElementById('next_btn');

    let wordsAndMeanings;
    let currentWordIndex = 0;
    let autoplayActive = false;
    let speechSynthesisInstance = null;
    let shuffledIndices = [];

    // Load words and meanings from JSON file
    fetch('G8reviser.json')
        .then(response => response.json())
        .then(data => {
            wordsAndMeanings = data;
            shuffledIndices = Array.from({ length: wordsAndMeanings.length }, (_, index) => index);
            shuffleDisplay(shuffledIndices);
            displayWordAndMeaning(shuffledIndices[0]);
        })
        .catch(error => console.error('Error loading words and meanings:', error));

    function shuffleDisplay(array){
        for(let i = array.length-1; i >= 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    nextBtn.addEventListener('click', nextButton);
    function nextButton() {
        currentWordIndex++;
        if (currentWordIndex < shuffledIndices.length) {
            displayWordAndMeaning(shuffledIndices[currentWordIndex]);
            pauseAutoplay();
            if (autoplayActive) {
                startOrResumeAutoplay(); 
            }
        }
    }

    prevBtn.addEventListener('click', previousButton);
    function previousButton(){
        currentWordIndex--;
        if(currentWordIndex >= 0){
            displayWordAndMeaning(shuffledIndices[currentWordIndex]);
            pauseAutoplay();
            if (autoplayActive) {
                startOrResumeAutoplay(); 
            }
        }
    }

    playBtn.addEventListener('click', () => {
        startOrResumeAutoplay();
    });

    pauseBtn.addEventListener('click', () => {
        pauseAutoplay();
    });

    pronounceBtn.addEventListener('click', ()=>{
        speakCurrentWordOnly();
    });

    restartBtn.addEventListener('click', () => {
        // Reload the page when the restart button is clicked
        window.location.reload();
    })

    function speakCurrentWordOnly() {
        const wordData = wordsAndMeanings[shuffledIndices[currentWordIndex]];
        if (!wordData) {
            return;
        }
        const { word } = wordData;
        const speech = new SpeechSynthesisUtterance(word); // Only pronounce the word
        speechSynthesisInstance = speech;
        speech.onend = () => {
            if (autoplayActive && currentWordIndex < wordsAndMeanings.length - 1) {
                setTimeout(() => {
                    currentWordIndex++;
                    displayWordAndMeaning(shuffledIndices[currentWordIndex]);
                    speakCurrentWord();
                }, 800);
            } else if (!autoplayActive) {
                speechSynthesisInstance = null;
            }
        };
        window.speechSynthesis.speak(speech);
    }
    function startOrResumeAutoplay() {
        autoplayActive = true;
        playBtn.disabled = true;
        playBtn.style.backgroundColor = 'lightgray';
        pronounceBtn.disabled = true;
        if (!speechSynthesisInstance) {
            speakCurrentWord();
        } else {
            resumeAutoplay();
        }
    }

    function pauseAutoplay() {
        autoplayActive = false;
        playBtn.disabled = false;
        playBtn.style.backgroundColor = '#007bff';
        pronounceBtn.disabled = false;
        if (speechSynthesisInstance) {
            window.speechSynthesis.cancel();
        }
    }

    function resumeAutoplay() {
        playBtn.disabled = true;
        playBtn.style.backgroundColor = 'lightgray';
        speakCurrentWord();
    }

    function speakCurrentWord() {
        const wordData = wordsAndMeanings[shuffledIndices[currentWordIndex]];
        if (!wordData) {
            return;
        }
        const { word, meaning } = wordData;
        const speech = new SpeechSynthesisUtterance(`${word}. ${meaning}`);
        speechSynthesisInstance = speech;
        speech.onend = () => {
            if (autoplayActive && currentWordIndex < shuffledIndices.length - 1) {
                currentWordIndex++;
                displayWordAndMeaning(shuffledIndices[currentWordIndex]);
                speakCurrentWord(); 
            } else if (!autoplayActive) {
                speechSynthesisInstance = null;
            }
        };
        window.speechSynthesis.speak(speech);
    }

    function displayWordAndMeaning(index) {
        const wordData = wordsAndMeanings[index];
        if (wordData) {
            const { word, meaning } = wordData;
            wordDisplay.innerText = word;
            meaningDisplay.innerText = meaning;
        }
    }

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            const searchTerm = searchInput.value.trim().toLowerCase();
            const searchResultIndex = wordsAndMeanings.findIndex(item => item.word.toLowerCase() === searchTerm);
            if (searchResultIndex !== -1) {
                currentWordIndex = shuffledIndices.indexOf(searchResultIndex);
                pauseAutoplay(); 
                displayWordAndMeaning(shuffledIndices[currentWordIndex]); 
                speakCurrentWord(); 
            } else {
                alert('Word not found');
            }
            searchInput.value = '';
        }
    });

});
