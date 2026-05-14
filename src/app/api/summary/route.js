export async function POST(req) {
    try {
      const { content } = await req.json()
  
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'openai/gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: `Summarize this blog in around 80 to 100 words:\n\n${content}`
              }
            ]
          })
        }
      )
  
      const data = await response.json()
  
      const summary =
        data?.choices?.[0]?.message?.content || ''
  
      return Response.json({
        summary
      })
  
    } catch (error) {
      return Response.json(
        {
          error: error.message
        },
        {
          status: 500
        }
      )
    }
  }