'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { AdminHeader } from '../components/AdminHeader'
import { StatCard } from '../components/StatCard'
import { StageBadge } from '@/components/ui/Badge'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { Users, Phone, CheckCircle, Target, TrendingUp, FileText } from 'lucide-react'
import { PipelineStage, PIPELINE_STAGES } from '@/types/lead'
import Link from 'next/link'

interface DashboardStats {
  totalLeads: number
  byStage: Record<PipelineStage, number>
  averageScore: number
  totalDeals: number
  recentActivity: {
    type: string
    leadId: string
    message: string
    timestamp: string
  }[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminDashboardPage() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    '/api/admin/stats',
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
    }
  )

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await mutate()
    setIsRefreshing(false)
  }

  // Calculate stage counts
  const stageCounts = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: data?.byStage?.[stage.value] ?? 0,
  }))

  // Calculate conversion rate (closed / total)
  const conversionRate = data?.totalLeads
    ? Math.round(((data.byStage?.closed ?? 0) / data.totalLeads) * 100)
    : 0

  return (
    <div className="flex flex-col h-full">
      <AdminHeader
        title="Dashboard"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Total Leads"
                value={data?.totalLeads ?? 0}
                icon={Users}
              />
              <StatCard
                title="Avg. Lead Score"
                value={data?.averageScore ?? 0}
                icon={Target}
              />
              <StatCard
                title="Conversion Rate"
                value={`${conversionRate}%`}
                icon={TrendingUp}
              />
              <StatCard
                title="Active Deals"
                value={data?.totalDeals ?? 0}
                icon={FileText}
              />
            </>
          )}
        </div>

        {/* Pipeline Overview */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Pipeline Overview
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Lead distribution across stages
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {stageCounts.map((stage) => (
                <Link
                  key={stage.value}
                  href={`/admin/leads?stage=${stage.value}`}
                  className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="text-2xl font-bold text-gray-900">
                    {stage.count}
                  </div>
                  <StageBadge stage={stage.value} className="mt-2" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Latest lead updates
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all leads →
            </Link>
          </div>
          <div className="divide-y">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : data?.recentActivity?.length ? (
              data.recentActivity.slice(0, 5).map((activity, i) => (
                <div key={i} className="p-4 flex items-start gap-4">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    {activity.type === 'stage_change' ? (
                      <CheckCircle className="h-5 w-5 text-primary-600" />
                    ) : (
                      <Phone className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No recent activity
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/leads"
            className="bg-white rounded-xl border shadow-sm p-6 hover:border-primary-300 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Leads</h3>
                <p className="text-sm text-gray-500">
                  View and manage all leads in the pipeline
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/deals"
            className="bg-white rounded-xl border shadow-sm p-6 hover:border-primary-300 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-50 rounded-lg">
                <FileText className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload Deals</h3>
                <p className="text-sm text-gray-500">
                  Upload and process deal memos
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
