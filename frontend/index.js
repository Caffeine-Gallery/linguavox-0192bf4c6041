import { backend } from "declarations/backend";

let currentTranslation = "";
const sourceText = document.getElementById("sourceText");
const targetLanguage = document.getElementById("targetLanguage");
const translatedText = document.getElementById("translatedText");
const speakButton = document.getElementById("speakButton");
const historyList = document.getElementById("historyList");

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Translate text using MyMemory API
async function translateText(text, targetLang) {
    if (!text) return;
    
    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
        );
        const data = await response.json();
        
        if (data.responseData) {
            currentTranslation = data.responseData.translatedText;
            translatedText.value = currentTranslation;
            speakButton.disabled = false;
            
            // Save translation to backend
            await backend.saveTranslation(text, currentTranslation, targetLang);
            await loadTranslationHistory();
        }
    } catch (error) {
        console.error("Translation error:", error);
        translatedText.value = "Error during translation";
    }
}

// Format timestamp
function formatTimestamp(timestamp) {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
}

// Load translation history
async function loadTranslationHistory() {
    try {
        const history = await backend.getTranslations();
        historyList.innerHTML = history.reverse().map(item => `
            <div class="history-item">
                <p><strong>Original:</strong> ${item.sourceText}</p>
                <p><strong>Translation (${item.targetLanguage}):</strong> ${item.translatedText}</p>
                <p class="timestamp">${formatTimestamp(item.timestamp)}</p>
            </div>
        `).join("");
    } catch (error) {
        console.error("Error loading history:", error);
    }
}

// Text-to-speech function
function speakText() {
    if (!currentTranslation) return;
    
    const utterance = new SpeechSynthesisUtterance(currentTranslation);
    utterance.lang = targetLanguage.value;
    window.speechSynthesis.speak(utterance);
}

// Event listeners
sourceText.addEventListener("input", debounce((e) => {
    translateText(e.target.value, targetLanguage.value);
}, 500));

targetLanguage.addEventListener("change", () => {
    if (sourceText.value) {
        translateText(sourceText.value, targetLanguage.value);
    }
});

speakButton.addEventListener("click", speakText);

// Initial history load
loadTranslationHistory();
