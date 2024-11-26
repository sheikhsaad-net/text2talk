const express = require('express');
const bodyParser = require('body-parser');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files (like index.html, CSS, JS)
app.use(express.static('public'));
app.use(bodyParser.json()); // Middleware to parse JSON request bodies

// Set Google credentials path
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'auth/text2talk-442509-ca74cc14daa4.json';

// Creates a client
const client = new TextToSpeechClient();

// Endpoint to handle text-to-speech requests
app.post('/speak', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send('Text is required');
  }

  const request = {
    input: { text },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  client.synthesizeSpeech(request, (err, response) => {
    if (err) {
      console.error('ERROR:', err);
      return res.status(500).send('Error synthesizing speech');
    }

    // Write the binary audio content to a file
    const outputPath = path.join(__dirname, 'public', 'audio', 'output.mp3');
    fs.writeFileSync(outputPath, response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');

    // Send the path of the generated audio file
    res.send({ audioUrl: '/audio/output.mp3' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
