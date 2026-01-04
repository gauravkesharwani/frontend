'use client'

import { useState } from 'react'
import { AdminHeader } from '../../components/AdminHeader'
import { DealUploader } from './components/DealUploader'
import { DealsList } from './components/DealsList'
import { DealPreview } from './components/DealPreview'
import { useDeals } from '@/hooks/useDeals'
import { DealMemoExtraction } from '@/types/deal'
import { useToast } from '@/components/ui/Toast'

export default function DealsPage() {
  const { deals, isLoading, mutate } = useDeals()
  const { addToast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [extraction, setExtraction] = useState<DealMemoExtraction | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await mutate()
    setIsRefreshing(false)
  }

  const handleExtractionComplete = (data: DealMemoExtraction) => {
    setExtraction(data)
    setIsPreviewOpen(true)
  }

  const handleSaveDeal = async () => {
    // After saving, refresh the list and close preview
    await mutate()
    setIsPreviewOpen(false)
    setExtraction(null)
    addToast('success', 'Deal saved successfully')
  }

  const handleCancelPreview = () => {
    setIsPreviewOpen(false)
    setExtraction(null)
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader
        title="Deal Ingestion"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Upload Section */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Upload Deal Memo
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Upload a PDF or DOCX file to extract deal information using AI
            </p>
          </div>
          <div className="p-6">
            <DealUploader onExtractionComplete={handleExtractionComplete} />
          </div>
        </div>

        {/* Deals List */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Ingested Deals
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {deals.length} deal{deals.length !== 1 ? 's' : ''} available for matching
            </p>
          </div>
          <DealsList deals={deals} isLoading={isLoading} onUpdate={mutate} />
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && extraction && (
        <DealPreview
          extraction={extraction}
          onSave={handleSaveDeal}
          onCancel={handleCancelPreview}
        />
      )}
    </div>
  )
}
