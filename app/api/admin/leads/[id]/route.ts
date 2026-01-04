import { NextRequest, NextResponse } from 'next/server'
import { LeadWithDetails } from '@/types/lead'

// Mock lead data - in production this would come from the database
const mockLead: LeadWithDetails = {
  id: 'lead_001',
  phone: '+15551234567',
  timeline: '3-6 months',
  capitalAvailable: 250000,
  investmentPreferences: ['residential', 'commercial'],
  investmentThesis: 'Looking for stable cash flow properties in growing markets with potential for value-add opportunities.',
  riskTolerance: 'moderate',
  stage: 'deals_matched',
  leadScore: 85,
  source: 'web',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  calls: [
    {
      id: 'call_001',
      status: 'completed',
      duration: 342,
      transcript: `Agent: Hi, this is Alti. Thanks for chatting with us - I promised I'd call fast, right?

Investor: Hey, yes! That was quick.

Agent: So you mentioned you're looking to deploy about $250K in the next 3-6 months. What's driving that timeline?

Investor: Well, I just sold a rental property and I'm looking to 1031 exchange into something more passive. I'm tired of dealing with tenants.

Agent: I hear you - tenant calls at 2am are no fun. So you're looking for something more hands-off. Are you thinking syndications or maybe a fund structure?

Investor: I'm open to both, honestly. I've done some direct investing but I'm interested in diversifying.

Agent: Makes sense. What kind of returns are you targeting?

Investor: Ideally 12-15% IRR. I'm not looking for moonshots, just steady cash flow with some upside.

Agent: Perfect. Based on what you're telling me, I think we have some opportunities that could be a great fit. I'm going to connect you with one of our partners who specializes in exactly this type of deal. Expect a call within 24 hours. Sound good?

Investor: Sounds great, thanks!`,
      initiatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 342000).toISOString(),
    },
  ],
  matches: [
    {
      id: 'match_001',
      dealMemoId: 'deal_001',
      dealName: 'Sunset Apartments Fund III',
      similarityScore: 0.87,
      matchReasons: ['capital_fit', 'timeline_match', 'property_type', 'risk_profile'],
      status: 'pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 'match_002',
      dealMemoId: 'deal_002',
      dealName: 'Metro Commercial REIT',
      similarityScore: 0.82,
      matchReasons: ['capital_fit', 'property_type'],
      status: 'pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 'match_003',
      dealMemoId: 'deal_003',
      dealName: 'Pacific Multifamily Partners',
      similarityScore: 0.79,
      matchReasons: ['timeline_match', 'risk_profile'],
      status: 'pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ],
  notes: [
    {
      id: 'note_001',
      content: 'Investor mentioned 1031 exchange deadline - needs to close within 180 days',
      createdBy: 'admin',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'note_002',
      content: 'Prefers deals in Sun Belt markets',
      createdBy: 'admin',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ],
  stageHistory: [
    {
      id: 'history_001',
      fromStage: null,
      toStage: 'new_lead',
      changedBy: 'system',
      changedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: 'history_002',
      fromStage: 'new_lead',
      toStage: 'call_dispatched',
      changedBy: 'system',
      changedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 30000).toISOString(),
    },
    {
      id: 'history_003',
      fromStage: 'call_dispatched',
      toStage: 'call_completed',
      changedBy: 'system',
      changedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'history_004',
      fromStage: 'call_completed',
      toStage: 'insights_extracted',
      changedBy: 'system',
      changedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      id: 'history_005',
      fromStage: 'insights_extracted',
      toStage: 'deals_matched',
      changedBy: 'system',
      changedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ],
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // In production, fetch from database:
    // const lead = await db.leads.findUnique({ where: { id } })

    // For now, return mock data with the requested ID
    const lead = { ...mockLead, id }

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // In production, update in database:
    // const lead = await db.leads.update({ where: { id }, data: body })

    console.log('Updating lead:', id, body)

    return NextResponse.json({
      success: true,
      lead: { ...mockLead, id, ...body },
    })
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}
