document.getElementById('consultaForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const instruction = document.getElementById('instruction').value;
    let textInput = document.getElementById('text-input').value;

    const pdfFile = document.getElementById('upload-pdf').files[0];

    if (pdfFile) {
        textInput = await extractTextFromPDF(pdfFile);
    }

    const apiKey = ''; // Asegúrate de usar tu API Key

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo-0125", // O el modelo más avanzado disponible
                messages: [
                    { role: "user", content: instruction },
                    { role: "user", content: textInput }
                ]
            })
        });

        const result = await response.json();
        const answer = result.choices[0].message.content;
        document.getElementById('response').value = answer;
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        document.getElementById('response').value = 'Hubo un error al obtener la respuesta.';
    }
});

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        text += pageText + ' ';
    }

    return text;
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.getElementById('download-gift').addEventListener('click', function() {
    const responseContent = document.getElementById('response').value;
    downloadFile('respuesta.gift', responseContent);
});

document.getElementById('download-xml').addEventListener('click', function() {
    const responseContent = document.getElementById('response').value;
    downloadFile('respuesta.xml', responseContent);
});