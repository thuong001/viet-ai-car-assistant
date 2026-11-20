export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const messages = body.messages || [];

    const result = await env.AI.run(
      '@cf/meta/llama-3.1-8b-instruct',
      {
        messages,
        max_tokens: 500
      }
    );

    return Response.json({
      message: {
        content: result.response || 'AI chưa có câu trả lời.'
      }
    });

  } catch (error) {
    return Response.json({
      error: 'Lỗi máy chủ AI: ' + error.message
    }, { status: 500 });
  }
}
