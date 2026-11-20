import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen2.5:3b',
        messages: req.body.messages,
        stream: false
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Không kết nối được Ollama'
    });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('VIET AI SERVER đang chạy tại cổng 3000');
});
