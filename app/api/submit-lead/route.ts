import { NextRequest, NextResponse } from 'next/server'
import { leadSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the incoming data
    const validatedData = leadSchema.parse(body)

    // TODO: In production, this would forward to your FastAPI backend
    // For now, we'll just log it and return success
    console.log('Lead submitted:', {
      timeline: validatedData.investmentTimeline,
      capital: validatedData.capitalAvailable,
      preferences: validatedData.investmentPreferences,
      phone: validatedData.phoneNumber,
      timestamp: validatedData.timestamp,
    })

    // Simulate API call to FastAPI backend
    // const response = await fetch('http://your-fastapi-backend/api/leads', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(validatedData),
    // })

    // For development, simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json(
      {
        success: true,
        message: 'Lead submitted successfully',
        leadId: `lead_${Date.now()}`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error submitting lead:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid data provided',
          errors: error,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit lead',
      },
      { status: 500 }
    )
  }
}
