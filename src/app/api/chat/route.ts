import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('API route called')
    const { message } = await request.json()
    console.log('Received message:', message)

    if (!message) {
      console.log('No message provided')
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    console.log('API key exists:', !!apiKey)

    if (!apiKey) {
      console.log('No API key configured')
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      )
    }

    const requestBody = {
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: message }
      ],
      stream: false,
    }
    console.log('Sending to OpenRouter:', requestBody)

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('OpenRouter response status:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API error:', errorData)
      return NextResponse.json(
        { error: `Failed to get response from OpenRouter: ${errorData}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('OpenRouter response data:', data)
    
    const aiResponse = data.choices?.[0]?.message?.content
    console.log('AI response:', aiResponse)

    if (!aiResponse) {
      console.log('No AI response in data')
      return NextResponse.json(
        { error: 'No response from AI model' },
        { status: 500 }
      )
    }

    console.log('Returning successful response')
    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    )
  }
} 