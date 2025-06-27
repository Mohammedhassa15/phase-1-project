// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (like index.html, index.js, style.css)
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
app.get('/api/cars', (req, res) => {
  res.json([{ brand: 'BMW' }, { brand: 'Toyota' }]);
});
