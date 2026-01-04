'use client'

import { Badge } from '@/components/ui/Badge'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { DealMemo } from '@/types/deal'
import { FileText, DollarSign, TrendingUp, Calendar } from 'lucide-react'

interface DealsListProps {
  deals: DealMemo[]
  isLoading: boolean
  onUpdate: () => void
}

export function DealsList({ deals, isLoading, onUpdate }: DealsListProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'paused':
        return 'warning'
      case 'closed':
        return 'default'
      default:
        return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <TableSkeleton rows={5} />
      </div>
    )
  }

  if (deals.length === 0) {
    return (
      <div className="p-12 text-center">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No deals ingested yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Upload a deal memo to get started
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {deals.map((deal) => (
        <div key={deal.id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">{deal.name}</h3>
                <Badge variant={getStatusVariant(deal.status) as 'default' | 'success' | 'warning' | 'error' | 'info'}>
                  {deal.status}
                </Badge>
              </div>

              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {deal.summary}
              </p>

              <div className="flex items-center gap-6 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span>Min: {formatCurrency(deal.minimumInvestment)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span>Target: {deal.targetReturn}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{deal.timeline}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                <Badge variant="info">{deal.dealType}</Badge>
                {deal.structure && <Badge>{deal.structure}</Badge>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
