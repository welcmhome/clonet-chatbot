import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Lead collection API called ===')
    
    const { name, email, phone, message } = await request.json()
    console.log('Received lead data:', { name, email, phone, message })

    if (!name || !email || !message) {
      console.log('Missing required fields')
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Prepare payload for Framer form
    const payload: any = {
      name,
      email,
      message
    }

    // Only include phone if provided
    if (phone) {
      payload.phone = phone
    }

    console.log('Sending to Framer form:', payload)

    const response = await fetch('https://api.framer.com/forms/v1/forms/c4472cbf-dbcd-48e6-b6e7-3a2fc4631697/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    console.log('Framer form response status:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Framer form error response:', errorData)
      console.error('Framer form error status:', response.status)
      
      return NextResponse.json(
        { error: `Form submission failed (${response.status}): ${errorData}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Framer form response data:', data)
    
    console.log('=== Lead collection successful ===')
    return NextResponse.json({ success: true, message: 'Lead submitted successfully' })
  } catch (error) {
    console.error('=== Lead collection API error ===')
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