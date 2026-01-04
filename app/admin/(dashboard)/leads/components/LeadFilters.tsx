'use client'

import { useState } from 'react'
import { LeadFilters as LeadFiltersType, PipelineStage, PIPELINE_STAGES } from '@/types/lead'
import { Filter, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeadFiltersProps {
  filters: LeadFiltersType
  onFilterChange: (filters: LeadFiltersType) => void
}

export function LeadFilters({ filters, onFilterChange }: LeadFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hasActiveFilters = !!(
    filters.stage ||
    filters.scoreMin ||
    filters.scoreMax ||
    filters.capitalMin ||
    filters.capitalMax
  )

  const handleStageFilter = (stage: PipelineStage | undefined) => {
    onFilterChange({ ...filters, stage })
    setIsOpen(false)
  }

  const clearFilters = () => {
    onFilterChange({})
  }

  return (
    <div className="flex items-center gap-3">
      {/* Stage Filter */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors',
            filters.stage
              ? 'border-primary-300 bg-primary-50 text-primary-700'
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          <Filter className="h-4 w-4" />
          <span>{filters.stage ? PIPELINE_STAGES.find(s => s.value === filters.stage)?.label : 'All Stages'}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 mt-1 bg-white border rounded-lg shadow-lg py-1 z-20 min-w-[180px]">
              <button
                onClick={() => handleStageFilter(undefined)}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm hover:bg-gray-50',
                  !filters.stage && 'bg-gray-100 font-medium'
                )}
              >
                All Stages
              </button>
              {PIPELINE_STAGES.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() => handleStageFilter(stage.value)}
                  className={cn(
                    'w-full text-left px-4 py-2 text-sm hover:bg-gray-50',
                    filters.stage === stage.value && 'bg-gray-100 font-medium'
                  )}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Capital Range */}
      <select
        value={filters.capitalMin ? `${filters.capitalMin}-${filters.capitalMax || ''}` : ''}
        onChange={(e) => {
          const value = e.target.value
          if (!value) {
            onFilterChange({ ...filters, capitalMin: undefined, capitalMax: undefined })
          } else {
            const [min, max] = value.split('-').map(Number)
            onFilterChange({ ...filters, capitalMin: min, capitalMax: max || undefined })
          }
        }}
        className="px-4 py-2 border rounded-lg text-sm border-gray-300 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
      >
        <option value="">All Capital</option>
        <option value="50000-100000">$50K - $100K</option>
        <option value="100000-250000">$100K - $250K</option>
        <option value="250000-500000">$250K - $500K</option>
        <option value="500000-">$500K+</option>
      </select>

      {/* Score Range */}
      <select
        value={filters.scoreMin ? `${filters.scoreMin}-${filters.scoreMax || 100}` : ''}
        onChange={(e) => {
          const value = e.target.value
          if (!value) {
            onFilterChange({ ...filters, scoreMin: undefined, scoreMax: undefined })
          } else {
            const [min, max] = value.split('-').map(Number)
            onFilterChange({ ...filters, scoreMin: min, scoreMax: max })
          }
        }}
        className="px-4 py-2 border rounded-lg text-sm border-gray-300 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
      >
        <option value="">All Scores</option>
        <option value="80-100">High (80-100)</option>
        <option value="60-79">Medium (60-79)</option>
        <option value="40-59">Low (40-59)</option>
        <option value="0-39">Very Low (0-39)</option>
      </select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  )
}
