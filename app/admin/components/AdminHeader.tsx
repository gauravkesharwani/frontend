'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, RefreshCw } from 'lucide-react'

interface AdminHeaderProps {
  title?: string
  showSearch?: boolean
  onSearch?: (query: string) => void
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function AdminHeader({
  title,
  showSearch = false,
  onSearch,
  onRefresh,
  isRefreshing = false,
}: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <header className="bg-white border-b px-6 h-[57px] flex items-center">
      <div className="flex items-center justify-between w-full">
        {/* Title */}
        {title && (
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        )}

        {/* Search */}
        {showSearch && (
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by phone number..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </form>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw
                className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          )}

          <button
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  )
}
