import React, { useState } from 'react';
import { franc } from 'franc-min'; // Import the franc function from the franc-min package
import langs from 'langs'; // Import the langs package to map codes to full language names

// Helper function to detect the language of the text
function detectLanguage(text: string): string {
    const langCode = franc(text); // Detect language code
    if (langCode === 'und') {
        return 'Could not reliably detect language';
    }

    const language = langs.where('3', langCode); // Use langs to get the full language name
    return language ? language.name : 'Unknown language';
}

// Helper function to translate the text to English using LibreTranslate API
async function translateToEnglish(text: string, sourceLang: string): Promise<string> {
    try {
        const response = await fetch("http://127.0.0.1:5000/translate", {
            method: "POST",
            body: JSON.stringify({
                text: text,
                sourceLang: sourceLang,
            }),
            headers: {
                "Content-Type": "application/json", // Set the content type to JSON
            },
        });

        // Handle the response
        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const data = await response.json(); // Parse the JSON response

        return data.translated_text; // Return the translated text
    } catch (error) {
        console.error('Error during translation:', error);
        return 'Translation failed'; // Return a failure message if there is an error
    }
}

const App: React.FC = () => {
    const [text, setText] = useState<string>('Bonjour tout le monde'); // Sample text
    const [language, setLanguage] = useState<string>(''); // Language state
    const [translatedText, setTranslatedText] = useState<string>(''); // Translated text state

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value); // Update the text state on input change
    };

    const handleDetectLanguage = async () => {
        const detectedLang = detectLanguage(text); // Detect the language of the text
        setLanguage(detectedLang); // Set the detected language in the state

        const langCode = franc(text); // Get the ISO language code
        if (langCode !== 'und') {
            const languageObj = langs.where('3', langCode); // Map ISO 639-3 code to language object
            if (languageObj) {
                const translated = await translateToEnglish(text, languageObj.name); // Use language name
                setTranslatedText(translated); // Set the translated text
            } else {
                setTranslatedText('Could not map language code to a valid language name');
            }
        } else {
            setTranslatedText('Could not translate, language detection failed');
        }
    };

    return (
        <div>
            <h1>Language Detector and Translator</h1>
            <input
                type="text"
                value={text}
                onChange={handleTextChange}
                placeholder="Type text here"
            />
            <button onClick={handleDetectLanguage}>Detect and Translate</button>
            <p>Text: {text}</p>
            <p>Detected Language: {language}</p>
            <p>Translated to English: {translatedText}</p>
        </div>
    );
};

export default App;
