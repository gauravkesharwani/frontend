'use client'

import { useState } from 'react'
import { DealMemoExtraction, DEAL_TYPES } from '@/types/deal'
import { useCreateDeal } from '@/hooks/useDeals'
import { useToast } from '@/components/ui/Toast'
import { X, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DealPreviewProps {
  extraction: DealMemoExtraction
  onSave: () => void
  onCancel: () => void
}

export function DealPreview({ extraction, onSave, onCancel }: DealPreviewProps) {
  const { createDeal } = useCreateDeal()
  const { addToast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  // Editable form state
  const [formData, setFormData] = useState({
    name: extraction.name,
    dealType: extraction.dealType,
    summary: extraction.summary,
    thesis: extraction.thesis,
    minimumInvestment: extraction.minimumInvestment,
    targetReturn: extraction.targetReturn,
    riskFactors: extraction.riskFactors,
    idealInvestorProfile: extraction.idealInvestorProfile,
    structure: extraction.structure,
    timeline: extraction.timeline,
    status: 'active' as const,
  })

  const handleChange = (
    field: keyof typeof formData,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    const result = await createDeal(formData)

    if (result.success) {
      onSave()
    } else {
      addToast('error', result.error || 'Failed to save deal')
    }

    setIsSaving(false)
  }

  const confidenceColor =
    extraction.confidence >= 0.9
      ? 'text-green-600 bg-green-50'
      : extraction.confidence >= 0.7
      ? 'text-yellow-600 bg-yellow-50'
      : 'text-red-600 bg-red-50'

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Review Extracted Data
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  'text-sm px-2 py-0.5 rounded-full font-medium',
                  confidenceColor
                )}
              >
                {(extraction.confidence * 100).toFixed(0)}% confidence
              </span>
              {extraction.confidence < 0.9 && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Review carefully
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>

            {/* Deal Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal Type
              </label>
              <select
                value={formData.dealType}
                onChange={(e) => handleChange('dealType', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
              >
                {DEAL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Investment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Investment
              </label>
              <input
                type="number"
                value={formData.minimumInvestment}
                onChange={(e) =>
                  handleChange('minimumInvestment', parseInt(e.target.value, 10))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>

            {/* Target Return */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Return
              </label>
              <input
                type="text"
                value={formData.targetReturn}
                onChange={(e) => handleChange('targetReturn', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timeline
              </label>
              <input
                type="text"
                value={formData.timeline}
                onChange={(e) => handleChange('timeline', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>

            {/* Structure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Structure
              </label>
              <input
                type="text"
                value={formData.structure}
                onChange={(e) => handleChange('structure', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>

            {/* Summary */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summary
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
              />
            </div>

            {/* Thesis */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Investment Thesis
              </label>
              <textarea
                value={formData.thesis}
                onChange={(e) => handleChange('thesis', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
              />
            </div>

            {/* Ideal Investor Profile */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ideal Investor Profile
              </label>
              <textarea
                value={formData.idealInvestorProfile}
                onChange={(e) =>
                  handleChange('idealInvestorProfile', e.target.value)
                }
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
              />
            </div>

            {/* Risk Factors */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk Factors (comma-separated)
              </label>
              <input
                type="text"
                value={formData.riskFactors.join(', ')}
                onChange={(e) =>
                  handleChange(
                    'riskFactors',
                    e.target.value.split(',').map((s) => s.trim())
                  )
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Save Deal
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
