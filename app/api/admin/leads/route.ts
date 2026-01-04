import { NextRequest, NextResponse } from 'next/server'
import { LeadWithDetails, PipelineStage } from '@/types/lead'

// Mock data for leads
// In production, this would come from the database
const mockLeads: LeadWithDetails[] = [
  {
    id: 'lead_001',
    phone: '+15551234567',
    timeline: '3-6 months',
    capitalAvailable: 250000,
    investmentPreferences: ['residential', 'commercial'],
    investmentThesis: 'Looking for stable cash flow properties in growing markets',
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
        transcript: 'Call transcript placeholder...',
        initiatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 342000).toISOString(),
      },
    ],
    matches: [
      {
        id: 'match_001',
        dealMemoId: 'deal_001',
        dealName: 'Sunset Apartments Fund',
        similarityScore: 0.87,
        matchReasons: ['capital_fit', 'timeline_match', 'property_type'],
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ],
    notes: [],
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
    ],
  },
  {
    id: 'lead_002',
    phone: '+15559876543',
    timeline: '1-3 months',
    capitalAvailable: 500000,
    investmentPreferences: ['industrial', 'mixed-use'],
    riskTolerance: 'aggressive',
    stage: 'call_completed',
    leadScore: 92,
    source: 'web',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    calls: [],
    matches: [],
    notes: [
      {
        id: 'note_001',
        content: 'Very interested in warehouse properties',
        createdBy: 'admin',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
    ],
    stageHistory: [],
  },
  {
    id: 'lead_003',
    phone: '+15555551234',
    timeline: '6-12 months',
    capitalAvailable: 100000,
    investmentPreferences: ['residential'],
    riskTolerance: 'conservative',
    stage: 'new_lead',
    leadScore: 65,
    source: 'web',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    calls: [],
    matches: [],
    notes: [],
    stageHistory: [],
  },
  {
    id: 'lead_004',
    phone: '+15558889999',
    timeline: '3-6 months',
    capitalAvailable: 750000,
    investmentPreferences: ['commercial', 'office'],
    stage: 'under_review',
    leadScore: 78,
    source: 'web',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    calls: [],
    matches: [],
    notes: [],
    stageHistory: [],
  },
  {
    id: 'lead_005',
    phone: '+15551112222',
    timeline: '1+ years',
    capitalAvailable: 150000,
    investmentPreferences: ['land', 'residential'],
    stage: 'insights_extracted',
    leadScore: 70,
    source: 'web',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    calls: [],
    matches: [],
    notes: [],
    stageHistory: [],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const stage = searchParams.get('stage') as PipelineStage | null
    const search = searchParams.get('search')
    const scoreMin = searchParams.get('scoreMin')
    const scoreMax = searchParams.get('scoreMax')
    const capitalMin = searchParams.get('capitalMin')
    const capitalMax = searchParams.get('capitalMax')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)

    // Filter leads
    let filteredLeads = [...mockLeads]

    if (stage) {
      filteredLeads = filteredLeads.filter((lead) => lead.stage === stage)
    }

    if (search) {
      filteredLeads = filteredLeads.filter((lead) =>
        lead.phone.includes(search.replace(/\D/g, ''))
      )
    }

    if (scoreMin) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.leadScore >= parseInt(scoreMin, 10)
      )
    }

    if (scoreMax) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.leadScore <= parseInt(scoreMax, 10)
      )
    }

    if (capitalMin) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.capitalAvailable >= parseInt(capitalMin, 10)
      )
    }

    if (capitalMax) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.capitalAvailable <= parseInt(capitalMax, 10)
      )
    }

    // Sort leads
    filteredLeads.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'lead_score':
          comparison = a.leadScore - b.leadScore
          break
        case 'capital_available':
          comparison = a.capitalAvailable - b.capitalAvailable
          break
        case 'created_at':
        default:
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    // Paginate
    const total = filteredLeads.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize)

    return NextResponse.json({
      leads: paginatedLeads,
      total,
      page,
      pageSize,
      totalPages,
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}
