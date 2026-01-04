'use client'

import { useState } from 'react'
import { StageBadge, ScoreBadge } from '@/components/ui/Badge'
import { LeadWithDetails, PipelineStage, PIPELINE_STAGES } from '@/types/lead'
import { useUpdateLeadStage } from '@/hooks/useLeads'
import { useToast } from '@/components/ui/Toast'
import { ChevronDown, Phone, Calendar, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeadsTableProps {
  leads: LeadWithDetails[]
  onLeadClick: (lead: LeadWithDetails) => void
  onStageUpdate: () => void
}

export function LeadsTable({ leads, onLeadClick, onStageUpdate }: LeadsTableProps) {
  const { updateStage } = useUpdateLeadStage()
  const { addToast } = useToast()
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null)

  const handleStageChange = async (
    e: React.MouseEvent,
    leadId: string,
    newStage: PipelineStage
  ) => {
    e.stopPropagation()
    setUpdatingLeadId(leadId)

    const result = await updateStage(leadId, newStage)

    if (result.success) {
      addToast('success', 'Stage updated successfully')
      onStageUpdate()
    } else {
      addToast('error', result.error || 'Failed to update stage')
    }

    setUpdatingLeadId(null)
  }

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
    }
    return phone
  }

  const formatCapital = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffDays < 7) {
      return `${diffDays}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
              Phone
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
              Capital
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
              Timeline
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
              Stage
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
              Score
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              onClick={() => onLeadClick(lead)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {formatPhone(lead.phone)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {formatCapital(lead.capitalAvailable)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-700">{lead.timeline}</span>
              </td>
              <td className="px-6 py-4">
                <div className="relative inline-block group">
                  <button
                    className={cn(
                      'flex items-center gap-1',
                      updatingLeadId === lead.id && 'opacity-50 pointer-events-none'
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <StageBadge stage={lead.stage} />
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </button>
                  <div className="absolute left-0 mt-1 bg-white border rounded-lg shadow-lg py-1 z-10 hidden group-hover:block min-w-[160px]">
                    {PIPELINE_STAGES.map((stage) => (
                      <button
                        key={stage.value}
                        onClick={(e) => handleStageChange(e, lead.id, stage.value)}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm hover:bg-gray-50',
                          lead.stage === stage.value && 'bg-gray-100 font-medium'
                        )}
                      >
                        {stage.label}
                      </button>
                    ))}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <ScoreBadge score={lead.leadScore} />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {formatDate(lead.createdAt)}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
