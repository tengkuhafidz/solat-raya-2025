import { NextResponse } from 'next/server'

// In-memory token storage (server-side only)
let tokenData: {
  access_token: string
  expiry_timestamp: number
} | null = null

async function getOneMapToken(): Promise<string> {
  if (tokenData && tokenData.expiry_timestamp > Date.now() + 300000) {
    return tokenData.access_token
  }

  const response = await fetch(
    'https://www.onemap.gov.sg/api/auth/post/getToken',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: process.env.ONEMAP_EMAIL,
        password: process.env.ONEMAP_PASSWORD,
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to get token')
  }

  const data = await response.json()
  tokenData = {
    access_token: data.access_token,
    expiry_timestamp: Date.now() + (data.expiry_timestamp * 1000)
  }
  
  return data.access_token
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postalCode = searchParams.get('postalCode')

    if (!postalCode) {
      return NextResponse.json(
        { error: 'Postal code is required' },
        { status: 400 }
      )
    }

    const token = await getOneMapToken()
    
    const response = await fetch(
      `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=N`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'Mozilla/5.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`OneMap API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json(
      { error: 'Failed to geocode postal code' },
      { status: 500 }
    )
  }
} 