import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: {
    value: number
    label: string
  }
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border p-6 shadow-sm',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p
              className={cn(
                'text-sm mt-2',
                change.value >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {change.value >= 0 ? '+' : ''}
              {change.value}% {change.label}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary-50 rounded-lg">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
    </div>
  )
}
