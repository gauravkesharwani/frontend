export interface Lead {
  investmentTimeline: string
  capitalAvailable: string
  investmentPreferences: string[]
  phoneNumber: string
  consent: boolean
  timestamp: string
}

// Pipeline stages for lead management dashboard
export type PipelineStage =
  | 'new_lead'
  | 'call_dispatched'
  | 'call_completed'
  | 'insights_extracted'
  | 'deals_matched'
  | 'under_review'
  | 'closed'

export const PIPELINE_STAGES: { value: PipelineStage; label: string }[] = [
  { value: 'new_lead', label: 'New Lead' },
  { value: 'call_dispatched', label: 'Call Dispatched' },
  { value: 'call_completed', label: 'Call Completed' },
  { value: 'insights_extracted', label: 'Insights Extracted' },
  { value: 'deals_matched', label: 'Deals Matched' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'closed', label: 'Closed' },
]

export const STAGE_COLORS: Record<PipelineStage, string> = {
  new_lead: 'bg-blue-100 text-blue-800',
  call_dispatched: 'bg-yellow-100 text-yellow-800',
  call_completed: 'bg-orange-100 text-orange-800',
  insights_extracted: 'bg-purple-100 text-purple-800',
  deals_matched: 'bg-indigo-100 text-indigo-800',
  under_review: 'bg-pink-100 text-pink-800',
  closed: 'bg-green-100 text-green-800',
}

// Lead with full details for admin dashboard
export interface LeadWithDetails {
  id: string
  phone: string
  timeline: string
  capitalAvailable: number
  investmentPreferences: string[]
  investmentThesis?: string
  riskTolerance?: string
  stage: PipelineStage
  leadScore: number
  source: string
  createdAt: string
  updatedAt: string
  calls: CallRecord[]
  matches: DealMatch[]
  notes: LeadNote[]
  stageHistory: StageChange[]
}

// Call record from voice AI
export interface CallRecord {
  id: string
  status: 'initiated' | 'ringing' | 'answered' | 'completed' | 'failed'
  duration?: number
  transcript?: string
  recordingUrl?: string
  initiatedAt: string
  completedAt?: string
}

// Deal match from semantic matching
export interface DealMatch {
  id: string
  dealMemoId: string
  dealName: string
  similarityScore: number
  matchReasons: string[]
  status: 'pending' | 'presented' | 'accepted' | 'rejected'
  createdAt: string
}

// Note/comment from admin
export interface LeadNote {
  id: string
  content: string
  createdBy: string
  createdAt: string
}

// Stage transition history
export interface StageChange {
  id: string
  fromStage: PipelineStage | null
  toStage: PipelineStage
  changedBy: string
  notes?: string
  changedAt: string
}

// Lead filters for API
export interface LeadFilters {
  stage?: PipelineStage
  scoreMin?: number
  scoreMax?: number
  capitalMin?: number
  capitalMax?: number
  dateFrom?: string
  dateTo?: string
  search?: string
  sortBy?: 'created_at' | 'lead_score' | 'capital_available'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

// Lead list API response
export interface LeadListResponse {
  leads: LeadWithDetails[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type ChatState =
  | 'greeting'
  | 'question_1'  // Investment timeline
  | 'question_2'  // Capital available
  | 'question_3'  // Investment preferences
  | 'consent_gate'
  | 'phone_capture'
  | 'submitting'
  | 'submitted'
  | 'error'

export interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
}

export interface ChatContext {
  state: ChatState
  answers: {
    investmentTimeline?: string
    capitalAvailable?: string
    investmentPreferences?: string[]
  }
  messages: ChatMessage[]
  phoneNumber?: string
  consent?: boolean
}
