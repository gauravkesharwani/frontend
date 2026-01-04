import { NextRequest, NextResponse } from 'next/server'
import { DealMemo } from '@/types/deal'

// Mock deals data
const mockDeals: DealMemo[] = [
  {
    id: 'deal_001',
    name: 'Sunset Apartments Fund III',
    dealType: 'multifamily',
    summary: 'A value-add multifamily fund targeting Class B and C properties in Sun Belt markets with strong rent growth potential.',
    thesis: 'Capitalize on the migration trends to Sun Belt markets and the housing shortage driving strong rent growth. Focus on operational improvements and light renovations to increase NOI.',
    minimumInvestment: 100000,
    targetReturn: '15-18% IRR',
    riskFactors: ['market_risk', 'interest_rate_risk', 'execution_risk'],
    idealInvestorProfile: 'Accredited investors seeking passive income with moderate risk tolerance and a 5-7 year investment horizon.',
    structure: 'LP/GP',
    timeline: '5-7 years',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'deal_002',
    name: 'Metro Commercial REIT',
    dealType: 'commercial',
    summary: 'A diversified commercial REIT investing in retail and office properties in major metropolitan areas.',
    thesis: 'Focus on necessity-based retail and flexible office spaces that benefit from hybrid work trends.',
    minimumInvestment: 50000,
    targetReturn: '10-12% IRR',
    riskFactors: ['market_risk', 'tenant_risk'],
    idealInvestorProfile: 'Investors seeking steady income with lower volatility and quarterly distributions.',
    structure: 'REIT',
    timeline: 'Open-ended',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: 'deal_003',
    name: 'Pacific Industrial Partners',
    dealType: 'industrial',
    summary: 'Last-mile logistics and warehouse development fund focused on West Coast markets.',
    thesis: 'E-commerce growth and supply chain reshoring are driving unprecedented demand for industrial space.',
    minimumInvestment: 250000,
    targetReturn: '18-22% IRR',
    riskFactors: ['development_risk', 'market_risk', 'construction_risk'],
    idealInvestorProfile: 'Sophisticated investors with high risk tolerance seeking outsized returns.',
    structure: 'LP/GP',
    timeline: '3-5 years',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
]

export async function GET() {
  try {
    // In production, fetch from database
    return NextResponse.json({
      deals: mockDeals,
      total: mockDeals.length,
    })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'dealType', 'summary', 'thesis', 'minimumInvestment']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // In production, save to database
    const newDeal: DealMemo = {
      id: `deal_${Date.now()}`,
      ...body,
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log('Created new deal:', newDeal)

    return NextResponse.json(newDeal, { status: 201 })
  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}
