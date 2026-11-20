import './style.css'

document.querySelector('#app').innerHTML = `
  <main class="car-app">
    <header>
      <h1>🚘 VIET AI CAR</h1>
      <p>TRỢ LÝ THÔNG MINH TOYOTA AVANZA</p>
    </header>

    <section class="assistant">
      <div class="orb">🤖</div>
      <h2>Xin chào!</h2>
      <p>Tôi là trợ lý AI của bạn.</p>

      <button id="mic">🎙️ NÓI CHUYỆN VỚI AI</button>
      <p id="status">Sẵn sàng lắng nghe</p>

      <div id="conversation">
        <p>AI sẽ trả lời câu hỏi của bạn tại đây.</p>
      </div>
    </section>

    <section class="apps">
      <button id="youtube">▶ YOUTUBE</button>
      <button id="assistant">🤖 TRỢ LÝ AI</button>
    </section>
  </main>
`

const status = document.querySelector('#status')
const conversation = document.querySelector('#conversation')

let messages = [
  {
    role: 'system',
    content: 'Bạn là VIET AI CAR ASSISTANT, trợ lý thông minh dành cho người lái xe Toyota Avanza. Hãy trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu và thân thiện.'
  }
]

document.querySelector('#youtube').onclick = () => {
  window.location.href = 'https://www.youtube.com/'
}

document.querySelector('#assistant').onclick = () => {
  status.textContent = 'VIET AI CAR ASSISTANT sẵn sàng!'
}

async function askAI(words) {
  status.textContent = 'AI đang suy nghĩ...'
  conversation.textContent = 'Bạn hỏi: ' + words

  messages.push({
    role: 'user',
    content: words
  })

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    if (!response.ok) {
      throw new Error('Máy chủ AI trả về lỗi: ' + response.status)
    }

    const data = await response.json()
    const answer = data.message.content

    messages.push({
      role: 'assistant',
      content: answer
    })

    conversation.textContent =
      'Bạn hỏi: ' + words + '\n\nAI trả lời: ' + answer

    status.textContent = 'AI đã trả lời'

    const voice = new SpeechSynthesisUtterance(answer)
    voice.lang = 'vi-VN'
    voice.rate = 1
    speechSynthesis.speak(voice)

  } catch (error) {
    status.textContent = 'Lỗi kết nối AI'
    conversation.textContent = error.message
  }
}

document.querySelector('#mic').onclick = () => {
  const Speech = window.SpeechRecognition ||
    window.webkitSpeechRecognition

  if (!Speech) {
    alert('Trình duyệt chưa hỗ trợ nhận diện giọng nói')
    return
  }

  const recognition = new Speech()
  recognition.lang = 'vi-VN'
  recognition.continuous = false
  recognition.interimResults = false

  recognition.onstart = () => {
    status.textContent = 'Đang nghe bạn nói...'
  }

  recognition.onresult = (event) => {
    const words = event.results[0][0].transcript
    askAI(words)
  }

  recognition.onerror = (event) => {
    status.textContent = 'Lỗi micro: ' + event.error
  }

  recognition.start()
}