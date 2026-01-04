'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AdminHeader } from '../../components/AdminHeader'
import { LeadsTable } from './components/LeadsTable'
import { LeadFilters } from './components/LeadFilters'
import { LeadDetailDrawer } from './components/LeadDetailDrawer'
import { useLeads } from '@/hooks/useLeads'
import { LeadWithDetails, PipelineStage, LeadFilters as LeadFiltersType } from '@/types/lead'
import { TableSkeleton } from '@/components/ui/Skeleton'

export default function LeadsPage() {
  return (
    <Suspense fallback={<LeadsPageSkeleton />}>
      <LeadsPageContent />
    </Suspense>
  )
}

function LeadsPageSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-white px-6 py-4">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <TableSkeleton rows={10} />
        </div>
      </div>
    </div>
  )
}

function LeadsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedLead, setSelectedLead] = useState<LeadWithDetails | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Get initial filters from URL
  const initialFilters: LeadFiltersType = {
    stage: searchParams.get('stage') as PipelineStage | undefined,
    search: searchParams.get('search') || undefined,
    page: parseInt(searchParams.get('page') || '1', 10),
    pageSize: 20,
  }

  const [filters, setFilters] = useState<LeadFiltersType>(initialFilters)

  const { leads, total, page, totalPages, isLoading, isError, mutate } = useLeads({
    ...filters,
    refreshInterval: 10000,
  })

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await mutate()
    setIsRefreshing(false)
  }

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query || undefined, page: 1 }))
    updateURL({ ...filters, search: query || undefined, page: 1 })
  }

  const handleFilterChange = (newFilters: LeadFiltersType) => {
    setFilters({ ...newFilters, page: 1 })
    updateURL({ ...newFilters, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
    updateURL({ ...filters, page: newPage })
  }

  const updateURL = (newFilters: LeadFiltersType) => {
    const params = new URLSearchParams()
    if (newFilters.stage) params.set('stage', newFilters.stage)
    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.page && newFilters.page > 1) params.set('page', newFilters.page.toString())

    const queryString = params.toString()
    router.push(`/admin/leads${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }

  const handleLeadClick = (lead: LeadWithDetails) => {
    setSelectedLead(lead)
    setIsDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    setSelectedLead(null)
  }

  const handleLeadUpdate = () => {
    mutate()
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader
        title="Leads"
        showSearch
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Filters */}
        <LeadFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Stats bar */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {leads.length} of {total} leads
          </span>
          {filters.stage && (
            <button
              onClick={() => handleFilterChange({ ...filters, stage: undefined })}
              className="text-primary-600 hover:text-primary-700"
            >
              Clear stage filter
            </button>
          )}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <TableSkeleton rows={10} />
          </div>
        ) : isError ? (
          <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-red-600">
            Error loading leads. Please try again.
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
            <p className="text-gray-500">No leads found</p>
            {(filters.stage || filters.search) && (
              <button
                onClick={() => handleFilterChange({})}
                className="mt-2 text-primary-600 hover:text-primary-700 text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <LeadsTable
              leads={leads}
              onLeadClick={handleLeadClick}
              onStageUpdate={handleLeadUpdate}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lead Detail Drawer */}
      <LeadDetailDrawer
        leadId={selectedLead?.id || null}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onUpdate={handleLeadUpdate}
      />
    </div>
  )
}
