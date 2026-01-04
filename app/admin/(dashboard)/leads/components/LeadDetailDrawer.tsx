'use client'

import { useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { StageBadge, ScoreBadge, Badge } from '@/components/ui/Badge'
import { DetailsSkeleton } from '@/components/ui/Skeleton'
import { useLead, useUpdateLeadStage, useAddLeadNote } from '@/hooks/useLeads'
import { useToast } from '@/components/ui/Toast'
import { PIPELINE_STAGES, PipelineStage } from '@/types/lead'
import {
  Phone,
  DollarSign,
  Clock,
  Target,
  MessageSquare,
  FileText,
  ChevronRight,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeadDetailDrawerProps {
  leadId: string | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function LeadDetailDrawer({
  leadId,
  isOpen,
  onClose,
  onUpdate,
}: LeadDetailDrawerProps) {
  const { lead, isLoading, mutate } = useLead(leadId)
  const { updateStage } = useUpdateLeadStage()
  const { addNote } = useAddLeadNote()
  const { addToast } = useToast()

  const [newNote, setNewNote] = useState('')
  const [isUpdatingStage, setIsUpdatingStage] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)

  const handleStageChange = async (newStage: PipelineStage) => {
    if (!leadId) return
    setIsUpdatingStage(true)

    const result = await updateStage(leadId, newStage)

    if (result.success) {
      addToast('success', 'Stage updated successfully')
      mutate()
      onUpdate()
    } else {
      addToast('error', result.error || 'Failed to update stage')
    }

    setIsUpdatingStage(false)
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadId || !newNote.trim()) return

    setIsAddingNote(true)

    const result = await addNote(leadId, newNote.trim())

    if (result.success) {
      addToast('success', 'Note added')
      setNewNote('')
      mutate()
    } else {
      addToast('error', result.error || 'Failed to add note')
    }

    setIsAddingNote(false)
  }

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
    }
    return phone
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Lead Details" width="xl">
      {isLoading ? (
        <DetailsSkeleton />
      ) : !lead ? (
        <div className="text-center text-gray-500 py-8">Lead not found</div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Phone className="h-5 w-5 text-gray-400" />
                {formatPhone(lead.phone)}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <StageBadge stage={lead.stage} />
                <ScoreBadge score={lead.leadScore} />
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <DollarSign className="h-4 w-4" />
                Capital Available
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(lead.capitalAvailable)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Clock className="h-4 w-4" />
                Timeline
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {lead.timeline}
              </div>
            </div>
          </div>

          {/* Investment Preferences */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Investment Preferences
            </h3>
            <div className="flex flex-wrap gap-2">
              {lead.investmentPreferences.map((pref) => (
                <Badge key={pref} variant="info">
                  {pref}
                </Badge>
              ))}
            </div>
          </div>

          {/* Investment Thesis */}
          {lead.investmentThesis && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Investment Thesis
              </h3>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                {lead.investmentThesis}
              </p>
            </div>
          )}

          {/* Stage Update */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Update Stage
            </h3>
            <div className="flex flex-wrap gap-2">
              {PIPELINE_STAGES.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() => handleStageChange(stage.value)}
                  disabled={isUpdatingStage || lead.stage === stage.value}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                    lead.stage === stage.value
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600',
                    isUpdatingStage && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Call History */}
          {lead.calls.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Call History
              </h3>
              <div className="space-y-3">
                {lead.calls.map((call) => (
                  <div
                    key={call.id}
                    className="bg-gray-50 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          call.status === 'completed' ? 'success' : 'warning'
                        }
                      >
                        {call.status}
                      </Badge>
                      {call.duration && (
                        <span className="text-sm text-gray-500">
                          {formatDuration(call.duration)}
                        </span>
                      )}
                    </div>
                    {call.transcript && (
                      <details className="group">
                        <summary className="text-sm text-primary-600 cursor-pointer flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          View Transcript
                          <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
                        </summary>
                        <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap bg-white rounded p-3 border max-h-60 overflow-auto">
                          {call.transcript}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Deals */}
          {lead.matches.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Matched Deals
              </h3>
              <div className="space-y-2">
                {lead.matches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {match.dealName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Score: {(match.similarityScore * 100).toFixed(0)}%
                      </div>
                    </div>
                    <Badge
                      variant={match.status === 'pending' ? 'warning' : 'success'}
                    >
                      {match.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Notes
            </h3>
            {lead.notes.length > 0 && (
              <div className="space-y-2 mb-3">
                {lead.notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-gray-50 rounded-lg p-3"
                  >
                    <p className="text-sm text-gray-700">{note.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {note.createdBy} • {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <button
                type="submit"
                disabled={isAddingNote || !newNote.trim()}
                className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Stage History */}
          {lead.stageHistory.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Stage History
              </h3>
              <div className="space-y-2">
                {lead.stageHistory.map((change, i) => (
                  <div
                    key={change.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full mt-1.5',
                        i === 0 ? 'bg-primary-500' : 'bg-gray-300'
                      )}
                    />
                    <div>
                      <span className="text-gray-900">
                        {change.fromStage ? (
                          <>
                            {PIPELINE_STAGES.find(s => s.value === change.fromStage)?.label} →{' '}
                          </>
                        ) : (
                          'Created as '
                        )}
                        {PIPELINE_STAGES.find(s => s.value === change.toStage)?.label}
                      </span>
                      <span className="text-gray-400 ml-2">
                        {new Date(change.changedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Drawer>
  )
}
