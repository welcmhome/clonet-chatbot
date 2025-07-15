import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== API route called ===')
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
    console.log('API key length:', apiKey?.length || 0)

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
    console.log('Sending to OpenRouter:', JSON.stringify(requestBody, null, 2))

    console.log('Making fetch request to OpenRouter...')
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('OpenRouter response status:', response.status)
    console.log('OpenRouter response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API error response:', errorData)
      console.error('OpenRouter API error status:', response.status)
      return NextResponse.json(
        { error: `OpenRouter API error (${response.status}): ${errorData}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('OpenRouter response data:', JSON.stringify(data, null, 2))
    
    const aiResponse = data.choices?.[0]?.message?.content
    console.log('AI response extracted:', aiResponse)

    if (!aiResponse) {
      console.log('No AI response in data structure')
      console.log('Data structure:', JSON.stringify(data, null, 2))
      return NextResponse.json(
        { error: 'No response from AI model - unexpected data structure' },
        { status: 500 }
      )
    }

    console.log('=== Returning successful response ===')
    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('=== Chat API error ===')
    console.error('Error type:', typeof error)
    console.error('Error message:', (error as Error)?.message)
    console.error('Error stack:', (error as Error)?.stack)
    console.error('Full error object:', error)
    
    return NextResponse.json(
      { error: `Server error: ${(error as Error)?.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
} 