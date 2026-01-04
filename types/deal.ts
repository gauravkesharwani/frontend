// Deal memo types for admin dashboard

export interface DealMemo {
  id: string
  name: string
  dealType: string
  summary: string
  thesis: string
  minimumInvestment: number
  targetReturn: string
  riskFactors: string[]
  idealInvestorProfile: string
  structure: string
  timeline: string
  status: 'active' | 'closed' | 'paused'
  createdAt: string
  updatedAt: string
}

// AI extraction result from document upload
export interface DealMemoExtraction {
  name: string
  dealType: string
  summary: string
  thesis: string
  minimumInvestment: number
  targetReturn: string
  riskFactors: string[]
  idealInvestorProfile: string
  structure: string
  timeline: string
  confidence: number
  rawText: string
}

// Upload response
export interface DealUploadResponse {
  uploadId: string
  filename: string
  status: 'uploaded' | 'processing' | 'error'
}

// Extraction response
export interface DealExtractionResponse {
  extraction: DealMemoExtraction
  rawText: string
}

// Deal list response
export interface DealListResponse {
  deals: DealMemo[]
  total: number
}

// Deal type options
export const DEAL_TYPES = [
  'multifamily',
  'commercial',
  'industrial',
  'retail',
  'office',
  'mixed-use',
  'land',
  'hospitality',
  'healthcare',
  'self-storage',
  'mobile-home-park',
  'other',
] as const

export type DealType = typeof DEAL_TYPES[number]

// Deal status options
export const DEAL_STATUSES = ['active', 'closed', 'paused'] as const
export type DealStatus = typeof DEAL_STATUSES[number]
