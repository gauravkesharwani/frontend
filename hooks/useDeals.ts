import useSWR from 'swr'
import { DealListResponse, DealMemo, DealMemoExtraction } from '@/types/deal'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface UseDealsOptions {
  refreshInterval?: number
}

export function useDeals(options: UseDealsOptions = {}) {
  const { refreshInterval = 10000 } = options

  const { data, error, isLoading, mutate } = useSWR<DealListResponse>(
    '/api/admin/deals',
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: true,
    }
  )

  return {
    deals: data?.deals ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useDeal(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<DealMemo>(
    id ? `/api/admin/deals/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  )

  return {
    deal: data,
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for uploading deal documents
export function useUploadDeal() {
  const uploadDocument = async (
    file: File
  ): Promise<{ success: boolean; uploadId?: string; error?: string }> => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/deals/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || 'Upload failed' }
      }

      return { success: true, uploadId: data.uploadId }
    } catch {
      return { success: false, error: 'Network error' }
    }
  }

  return { uploadDocument }
}

// Hook for extracting deal data from uploaded document
export function useExtractDeal() {
  const extractData = async (
    uploadId: string
  ): Promise<{
    success: boolean
    extraction?: DealMemoExtraction
    error?: string
  }> => {
    try {
      const response = await fetch('/api/admin/deals/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || 'Extraction failed' }
      }

      return { success: true, extraction: data.extraction }
    } catch {
      return { success: false, error: 'Network error' }
    }
  }

  return { extractData }
}

// Hook for creating a deal from extracted data
export function useCreateDeal() {
  const createDeal = async (
    dealData: Omit<DealMemo, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; deal?: DealMemo; error?: string }> => {
    try {
      const response = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealData),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to create deal' }
      }

      return { success: true, deal: data }
    } catch {
      return { success: false, error: 'Network error' }
    }
  }

  return { createDeal }
}
