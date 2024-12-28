from flask import Flask, request, jsonify
from googletrans import Translator
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize the Google Translator
translator = Translator()

# API endpoint to handle translation
@app.route('/translate', methods=['POST'])
def translate():
    # Get JSON data from the request
    data = request.get_json()

    # Extract the text and source language from the JSON body
    text = data.get('text')
    source_language = data.get('sourceLang')  # Source language is required

    # Validate inputs
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    if not source_language:
        return jsonify({'error': 'No source language provided'}), 400

    try:
        # Translate the text to English
        translated = translator.translate(text, src=source_language, dest='en')
        return jsonify({
            'original_text': text,
            'translated_text': translated.text,
            'detected_source_language': translated.src,
            'target_language': 'en'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
