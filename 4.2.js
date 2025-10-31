const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(express.json());

// In-memory array to store cards
let cards = [];
let nextId = 1;

// ✅ Route 1: Get all cards
app.get('/cards', (req, res) => {
  res.json({
    message: "All cards fetched successfully",
    data: cards
  });
});

// ✅ Route 2: Add a new card
app.post('/cards', (req, res) => {
  const { suit, value } = req.body;

  if (!suit || !value) {
    return res.status(400).json({ error: "Please provide both 'suit' and 'value' fields" });
  }

  const newCard = { id: nextId++, suit, value };
  cards.push(newCard);

  res.status(201).json({
    message: "New card added successfully",
    data: newCard
  });
});

// ✅ Route 3: Get a specific card by ID
app.get('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const card = cards.find(c => c.id === id);

  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }

  res.json({
    message: "Card retrieved successfully",
    data: card
  });
});

// ✅ Route 4: Delete a card by ID
app.delete('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = cards.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Card not found" });
  }

  const removed = cards.splice(index, 1);
  res.json({
    message: "Card deleted successfully",
    data: removed[0]
  });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
