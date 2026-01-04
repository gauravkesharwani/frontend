'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/ui/FileUpload'
import { useUploadDeal, useExtractDeal } from '@/hooks/useDeals'
import { useToast } from '@/components/ui/Toast'
import { DealMemoExtraction } from '@/types/deal'
import { Loader2, CheckCircle } from 'lucide-react'

interface DealUploaderProps {
  onExtractionComplete: (extraction: DealMemoExtraction) => void
}

type UploadStatus = 'idle' | 'uploading' | 'extracting' | 'complete' | 'error'

export function DealUploader({ onExtractionComplete }: DealUploaderProps) {
  const { uploadDocument } = useUploadDeal()
  const { extractData } = useExtractDeal()
  const { addToast } = useToast()

  const [status, setStatus] = useState<UploadStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleUpload = async (file: File) => {
    setStatus('uploading')
    setStatusMessage('Uploading document...')

    // Step 1: Upload the file
    const uploadResult = await uploadDocument(file)

    if (!uploadResult.success || !uploadResult.uploadId) {
      setStatus('error')
      setStatusMessage(uploadResult.error || 'Upload failed')
      addToast('error', uploadResult.error || 'Upload failed')
      return
    }

    // Step 2: Extract data using AI
    setStatus('extracting')
    setStatusMessage('Extracting deal information with AI...')

    const extractResult = await extractData(uploadResult.uploadId)

    if (!extractResult.success || !extractResult.extraction) {
      setStatus('error')
      setStatusMessage(extractResult.error || 'Extraction failed')
      addToast('error', extractResult.error || 'Extraction failed')
      return
    }

    // Step 3: Complete
    setStatus('complete')
    setStatusMessage('Extraction complete! Review the data below.')
    addToast('success', 'Deal information extracted successfully')

    // Pass extraction to parent
    onExtractionComplete(extractResult.extraction)

    // Reset after a delay
    setTimeout(() => {
      setStatus('idle')
      setStatusMessage('')
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <FileUpload onUpload={handleUpload} />

      {/* Status indicator */}
      {status !== 'idle' && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg ${
            status === 'error'
              ? 'bg-red-50 text-red-700'
              : status === 'complete'
              ? 'bg-green-50 text-green-700'
              : 'bg-blue-50 text-blue-700'
          }`}
        >
          {status === 'uploading' || status === 'extracting' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : status === 'complete' ? (
            <CheckCircle className="h-5 w-5" />
          ) : null}
          <span className="text-sm font-medium">{statusMessage}</span>
        </div>
      )}
    </div>
  )
}
