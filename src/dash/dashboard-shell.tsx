'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { LayoutDashboard, Users, Briefcase, CalendarDays, Building2, RefreshCw } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { OverviewSection } from './overview-section'
import { EmployesSection } from './employes-section'
import { RecrutementSection } from './recrutement-section'
import { CongesSection } from './conges-section'

import "./dash.css"
import { getDashboard } from '@/api/dashboard/dashboard.service';
import { DashboardResponse } from '@/types/dashboard'

const tabs = [
  { value: 'apercu', label: "Vue d'ensemble", icon: LayoutDashboard },
  { value: 'employes', label: 'Employés', icon: Users },
  { value: 'recrutement', label: 'Recrutement', icon: Briefcase },
  { value: 'conges', label: 'Congés', icon: CalendarDays },
]

export default function DashboardShell() {
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);
  const loadDashboard = async () => {
    setLoading(true);

    const response = await getDashboard();

    setDashboard(response);

    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100)
    return () => clearTimeout(t)
  }, [])

  const refresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 900)
  }

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen  bg-background">
      <header className="">
      </header>

      <main className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* flex-col garantit que TabsList reste EN HAUT et TabsContent EN BAS */}
        <Tabs defaultValue="apercu" className="flex flex-col gap-6 w-full">

          {/* La barre d'onglets (En haut) */}
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="gap-1.5 data-[state=active]:shadow-sm">
                <t.icon className="size-4" aria-hidden="true" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Le contenu (En bas) */}
          <TabsContent value="apercu" className="mt-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <OverviewSection
                loading={loading}
                data={dashboard?.overview}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="employes" className="mt-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <EmployesSection
                loading={loading}
                data={dashboard?.employee}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="recrutement" className="mt-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <RecrutementSection
                loading={loading}
                data={dashboard?.recruitment}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="conges" className="mt-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <CongesSection
                loading={loading}
                data={dashboard?.leave}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
