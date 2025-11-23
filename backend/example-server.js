// Example Express server to simulate backend processing of redemptions
// Run: node backend/example-server.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());

// In-memory store for demonstration
const store = {
  redemptions: {},
};

// Process single redemption
app.post('/api/redemptions', async (req, res) => {
  const payload = req.body;
  if (!payload || !payload.id) return res.status(400).json({ success: false, message: 'Invalid payload' });

  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 1000 + Math.floor(Math.random() * 2000)));

  // Save to in-memory store
  store.redemptions[payload.id] = {
    ...payload,
    processedAt: new Date().toISOString(),
    status: 'completed',
  };

  // Example response
  res.json({ success: true, id: payload.id, processedAt: store.redemptions[payload.id].processedAt });
});

// Batch process
app.post('/api/redemptions/batch', async (req, res) => {
  const ids = (req.body && req.body.ids) || [];
  if (!Array.isArray(ids)) return res.status(400).json({ success: false, message: 'Invalid ids' });

  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 1500 + Math.floor(Math.random() * 2500)));

  const processed = [];
  for (const id of ids) {
    store.redemptions[id] = {
      id,
      processedAt: new Date().toISOString(),
      status: 'completed',
    };
    processed.push(id);
  }

  res.json({ success: true, processed });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(port, () => console.log(`Example backend running on http://localhost:${port}`));
