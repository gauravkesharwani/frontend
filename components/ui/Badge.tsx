import { cn } from '@/lib/utils'
import { PipelineStage, STAGE_COLORS, PIPELINE_STAGES } from '@/types/lead'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  className?: string
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

interface StageBadgeProps {
  stage: PipelineStage
  className?: string
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  const stageInfo = PIPELINE_STAGES.find((s) => s.value === stage)
  const colorClass = STAGE_COLORS[stage]

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colorClass,
        className
      )}
    >
      {stageInfo?.label || stage}
    </span>
  )
}

interface ScoreBadgeProps {
  score: number
  className?: string
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  let colorClass = 'bg-gray-100 text-gray-800'

  if (score >= 80) {
    colorClass = 'bg-green-100 text-green-800'
  } else if (score >= 60) {
    colorClass = 'bg-yellow-100 text-yellow-800'
  } else if (score >= 40) {
    colorClass = 'bg-orange-100 text-orange-800'
  } else {
    colorClass = 'bg-red-100 text-red-800'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colorClass,
        className
      )}
    >
      {score}
    </span>
  )
}
