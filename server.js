const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory high score list
let highScores = [];

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve files from "public" folder

// Route: POST /submit-score
app.post('/submit-score', (req, res) => {
  const { name, score } = req.body;

  if (typeof name === 'string' && typeof score === 'number') {
    highScores.push({ name: name.trim(), score });
    highScores.sort((a, b) => b.score - a.score); // Descending
    highScores = highScores.slice(0, 10); // Keep only top 10 scores

    console.log(`[Score Saved] ${name} - ${score}`);
    res.json({ success: true, message: 'Score submitted successfully!' });
  } else {
    res.status(400).json({ success: false, error: 'Invalid data format.' });
  }
});

// Route: GET /high-scores
app.get('/high-scores', (req, res) => {
  res.json(highScores);
});

// Route fallback for unknown paths
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
