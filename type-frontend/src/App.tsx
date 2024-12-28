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

const App: React.FC = () => {
    const [text, setText] = useState<string>('Bonjour tout le monde'); // Sample text
    const [language, setLanguage] = useState<string>(''); // Language state

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value); // Update the text state on input change
    };

    const handleDetectLanguage = () => {
        const detectedLang = detectLanguage(text); // Call the detectLanguage function
        setLanguage(detectedLang); // Set the detected language in the state
    };

    return (
        <div>
            <h1>Language Detector</h1>
            <input 
                type="text" 
                value={text} 
                onChange={handleTextChange} 
                placeholder="Type text here" 
            />
            <button onClick={handleDetectLanguage}>Detect Language</button>
            <p>Text: {text}</p>
            <p>Detected Language: {language}</p>
        </div>
    );
};

export default App;
