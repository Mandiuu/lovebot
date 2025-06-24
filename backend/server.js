const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

// More explicit CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Claude API endpoint
app.post('/api/claude', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    console.log('Received request:', prompt); // Debug log
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        messages: [
          {
            role: 'user',
            content: `You are LoveBot, a helpful assistant for couples preparing for US green card marriage interviews. You provide encouraging, professional guidance while being warm and supportive. Keep responses concise and helpful.\n\n${prompt}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Claude response:', data); // Debug log
    res.json({ success: true, message: data.content[0].text });
    
  } catch (error) {
    console.error('Claude API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});