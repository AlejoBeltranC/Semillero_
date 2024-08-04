from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    instruction = request.form['instruction']
    text_input = request.form['textInput']
    api_key = 'YOUR_API_KEY'  # Reemplaza con tu API Key de OpenAI

    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }

    data = {
        'model': 'gpt-4-turbo',  # O el modelo más avanzado disponible
        'messages': [
            {'role': 'user', 'content': instruction},
            {'role': 'user', 'content': text_input}
        ]
    }

    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)
    result = response.json()
    answer = result['choices'][0]['message']['content']
    return jsonify(answer=answer)

if __name__ == '__main__':
    app.run(debug=True)
