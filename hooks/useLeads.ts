import useSWR from 'swr'
import { LeadFilters, LeadListResponse, LeadWithDetails } from '@/types/lead'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function buildQueryString(filters: LeadFilters): string {
  const params = new URLSearchParams()

  if (filters.stage) params.set('stage', filters.stage)
  if (filters.scoreMin !== undefined) params.set('scoreMin', filters.scoreMin.toString())
  if (filters.scoreMax !== undefined) params.set('scoreMax', filters.scoreMax.toString())
  if (filters.capitalMin !== undefined) params.set('capitalMin', filters.capitalMin.toString())
  if (filters.capitalMax !== undefined) params.set('capitalMax', filters.capitalMax.toString())
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters.dateTo) params.set('dateTo', filters.dateTo)
  if (filters.search) params.set('search', filters.search)
  if (filters.sortBy) params.set('sortBy', filters.sortBy)
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
  if (filters.page) params.set('page', filters.page.toString())
  if (filters.pageSize) params.set('pageSize', filters.pageSize.toString())

  return params.toString()
}

interface UseLeadsOptions extends LeadFilters {
  refreshInterval?: number
}

export function useLeads(options: UseLeadsOptions = {}) {
  const { refreshInterval = 10000, ...filters } = options
  const queryString = buildQueryString(filters)
  const url = `/api/admin/leads${queryString ? `?${queryString}` : ''}`

  const { data, error, isLoading, mutate } = useSWR<LeadListResponse>(
    url,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  )

  return {
    leads: data?.leads ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? 20,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useLead(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<LeadWithDetails>(
    id ? `/api/admin/leads/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  )

  return {
    lead: data,
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for updating lead stage
export function useUpdateLeadStage() {
  const updateStage = async (
    leadId: string,
    stage: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage, notes }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to update stage' }
      }

      return { success: true }
    } catch {
      return { success: false, error: 'Network error' }
    }
  }

  return { updateStage }
}

// Hook for adding notes to a lead
export function useAddLeadNote() {
  const addNote = async (
    leadId: string,
    content: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to add note' }
      }

      return { success: true }
    } catch {
      return { success: false, error: 'Network error' }
    }
  }

  return { addNote }
}
