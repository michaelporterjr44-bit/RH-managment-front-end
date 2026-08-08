'use client'

import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import "./dash.css"

type ChartCardProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  loading?: boolean
  className?: string
  index?: number
}

export function ChartCard({
  title,
  description,
  action,
  children,
  loading,
  className,
  index = 0,
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      className={cn('h-full', className)}
    >
      <Card className="h-full border-border/70 shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold text-pretty">{title}</CardTitle>
            {description ? <CardDescription className="text-pretty">{description}</CardDescription> : null}
          </div>
          {action}
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-[260px] w-full rounded-xl" /> : children}
        </CardContent>
      </Card>
    </motion.div>
  )
}
