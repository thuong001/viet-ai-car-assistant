export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const messages = body.messages || [];

    const result = await env.AI.run(
      '@cf/openai/gpt-oss-20b',
      {
        messages,
        max_tokens: 500,
        stream: false
      }
    );

    let answer = '';

    // Dạng kết quả response
    if (typeof result.response === 'string') {
      answer = result.response;
    }

    // Dạng output_text
    if (!answer && typeof result.output_text === 'string') {
      answer = result.output_text;
    }

    // Dạng Responses API
    if (!answer && Array.isArray(result.output)) {
      for (const item of result.output) {
        if (Array.isArray(item.content)) {
          for (const part of item.content) {
            if (part.text) {
              answer += part.text;
            }
          }
        }
      }
    }

    // Dạng Chat Completions
    if (!answer && result.choices?.[0]?.message?.content) {
      answer = result.choices[0].message.content;
    }

    // Dạng message
    if (!answer && result.message?.content) {
      answer = result.message.content;
    }

    if (!answer) {
      console.log('AI result:', JSON.stringify(result));
      throw new Error('AI chưa trả về nội dung văn bản.');
    }

    return Response.json({
      message: {
        content: answer
      }
    });

  } catch (error) {
    console.error('AI ERROR:', error);

    return Response.json({
      error: 'Lỗi máy chủ AI: ' + error.message
    }, { status: 500 });
  }
}
