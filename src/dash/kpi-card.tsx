'use client'

import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import "./dash.css"

export type KpiTone = 'primary' | 'success' | 'warning' | 'destructive' | 'neutral'

const toneMap: Record<KpiTone, { icon: string; ring: string }> = {
  primary: { icon: 'bg-primary/10 text-primary', ring: 'group-hover:border-primary/30' },
  success: { icon: 'bg-[var(--success)]/12 text-[var(--success)]', ring: 'group-hover:border-[var(--success)]/30' },
  warning: { icon: 'bg-[var(--warning)]/15 text-[var(--warning)]', ring: 'group-hover:border-[var(--warning)]/30' },
  destructive: { icon: 'bg-destructive/10 text-destructive', ring: 'group-hover:border-destructive/30' },
  neutral: { icon: 'bg-muted text-muted-foreground', ring: 'group-hover:border-border' },
}

type KpiCardProps = {
  label: string
  value: string | number
  suffix?: string
  icon: LucideIcon
  tone?: KpiTone
  trend?: { value: number; positif: boolean }
  hint?: string
  loading?: boolean
  index?: number
}

export function KpiCard({
  label,
  value,
  suffix,
  icon: Icon,
  tone = 'primary',
  trend,
  hint,
  loading,
  index = 0,
}: KpiCardProps) {
  const tones = toneMap[tone]

  if (loading) {
    return (
      <Card className="border-border/70">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-28" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
    >
      <Card
        className={cn(
          'group h-full border-border/70 shadow-sm transition-all duration-200 hover:shadow-md',
          tones.ring,
        )}
      >
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium text-muted-foreground text-pretty">{label}</span>
            <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', tones.icon)}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-3xl font-semibold tracking-tight tabular-nums">{value}</span>
            {suffix ? <span className="pb-1 text-sm font-medium text-muted-foreground">{suffix}</span> : null}
          </div>
          <div className="flex items-center gap-2 text-xs">
            {trend ? (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium',
                  trend.positif
                    ? 'bg-[var(--success)]/12 text-[var(--success)]'
                    : 'bg-destructive/10 text-destructive',
                )}
              >
                {trend.positif ? (
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="size-3" aria-hidden="true" />
                )}
                {Math.abs(trend.value)}%
              </span>
            ) : null}
            {hint ? <span className="text-muted-foreground text-pretty">{hint}</span> : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
