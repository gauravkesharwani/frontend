import { NextResponse } from 'next/server'
import { PipelineStage } from '@/types/lead'

// Mock data for dashboard statistics
// In production, this would query the database
const mockStats = {
  totalLeads: 47,
  byStage: {
    new_lead: 8,
    call_dispatched: 5,
    call_completed: 12,
    insights_extracted: 7,
    deals_matched: 9,
    under_review: 4,
    closed: 2,
  } as Record<PipelineStage, number>,
  averageScore: 72,
  totalDeals: 15,
  recentActivity: [
    {
      type: 'stage_change',
      leadId: 'lead_001',
      message: 'Lead moved from "Call Completed" to "Insights Extracted"',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      type: 'new_lead',
      leadId: 'lead_002',
      message: 'New lead captured: +1 (555) 123-4567',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      type: 'stage_change',
      leadId: 'lead_003',
      message: 'Lead matched with 3 deals (score: 0.87)',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      type: 'call',
      leadId: 'lead_004',
      message: 'Voice call completed (duration: 5:42)',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      type: 'stage_change',
      leadId: 'lead_005',
      message: 'Lead closed - deal accepted',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ],
}

export async function GET() {
  try {
    // In production, fetch stats from database:
    // const stats = await db.query(...)

    // Add some randomization to simulate real-time updates
    const stats = {
      ...mockStats,
      totalLeads: mockStats.totalLeads + Math.floor(Math.random() * 3),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
