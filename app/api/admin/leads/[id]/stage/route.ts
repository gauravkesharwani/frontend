import { NextRequest, NextResponse } from 'next/server'
import { PipelineStage } from '@/types/lead'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { stage, notes } = body as { stage: PipelineStage; notes?: string }

    if (!stage) {
      return NextResponse.json(
        { error: 'Stage is required' },
        { status: 400 }
      )
    }

    // Validate stage value
    const validStages: PipelineStage[] = [
      'new_lead',
      'call_dispatched',
      'call_completed',
      'insights_extracted',
      'deals_matched',
      'under_review',
      'closed',
    ]

    if (!validStages.includes(stage)) {
      return NextResponse.json(
        { error: 'Invalid stage value' },
        { status: 400 }
      )
    }

    // In production:
    // 1. Update lead stage in database
    // 2. Create stage history record
    // 3. Trigger any automation (notifications, etc.)

    console.log('Updating lead stage:', { id, stage, notes })

    // Simulate database update
    const updatedLead = {
      id,
      stage,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead,
      message: `Stage updated to ${stage}`,
    })
  } catch (error) {
    console.error('Error updating stage:', error)
    return NextResponse.json(
      { error: 'Failed to update stage' },
      { status: 500 }
    )
  }
}
