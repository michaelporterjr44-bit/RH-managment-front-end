'use client'

import {
  Users,
  UserCheck,
  Palmtree,
  FileClock,
  Megaphone,
  UserPlus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { KpiCard } from './kpi-card'
import { ChartCard } from './chart-card'
import { SmartCards } from './smart-cards'
import "./dash.css"
import { OverviewDTO } from '@/types/dashboard'


type Props = {
  loading: boolean;
  data?: OverviewDTO;
}
const effectifConfig = {
  effectif: { label: 'Effectif total', color: 'var(--chart-1)' },
  recrutements: { label: 'Recrutements', color: 'var(--chart-3)' },
  departs: { label: 'Départs', color: 'var(--chart-5)' },
} satisfies ChartConfig

export function OverviewSection({ loading, data }: Props) {


  const k = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard loading={loading} index={0} label="Effectif total" value={k?.effectifTotal ?? 0} icon={Users} tone="primary" trend={{
          value: k?.evolutionEffectif ?? 0,
          positif: (k?.evolutionEffectif ?? 0) >= 0
        }} hint="vs mois dernier" />
        <KpiCard loading={loading} index={1} label="Employés actifs" value={k?.employesActifs?.toLocaleString("fr-FR") ?? 0} icon={UserCheck} tone="success" hint={`${k?.pourcentageEmployesActifs ?? 0}% de l'effectif`} />
        <KpiCard loading={loading} index={2} label="En congé" value={k?.employesEnConge ?? 0} icon={Palmtree} tone="warning" hint="actuellement absents" />
        <KpiCard loading={loading} index={3} label="Demandes en attente" value={k?.demandesEnAttente ?? 0} icon={FileClock} tone="warning" hint="à traiter" />
        <KpiCard loading={loading} index={4} label="Campagnes actives" value={k?.campagnesActives ?? 0} icon={Megaphone} tone="primary" hint="recrutement en cours" />
        <KpiCard loading={loading} index={5} label="Total postulants" value={k?.totalPostulants ?? 0} icon={UserPlus} tone="neutral" trend={{
          value: k?.evolutionPostulants ?? 0,
          positif: (k?.evolutionPostulants ?? 0) >= 0
        }} hint="candidatures" />
        <KpiCard loading={loading} index={6} label="Taux de recrutement" value={k?.tauxRecrutement ?? 0} suffix="%" icon={TrendingUp} tone="success" trend={{
          value: k?.evolutionTauxRecrutement ?? 0,
          positif: (k?.evolutionTauxRecrutement ?? 0) >= 0
        }} />
        <KpiCard loading={loading} index={7} label="Taux de démission" value={k?.tauxDemission ?? 0} suffix="%" icon={TrendingDown} tone="destructive" trend={{
          value: k?.evolutionTauxDemission ?? 0,
          positif: (k?.evolutionTauxDemission ?? 0) <= 0
        }} />
        <KpiCard loading={loading} index={8} label="Préavis en cours" value={k?.preavisEnCours ?? 0} icon={AlertTriangle} tone="destructive" hint="départs à venir" />
      </div>

      <ChartCard
        loading={loading}
        title="Évolution de l'effectif"
        description="Recrutements, départs et effectif total sur 12 mois"
      >
        <ChartContainer config={effectifConfig} className="h-[320px] w-full">
          <LineChart data={data?.effectifEvolution ?? []} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="mois" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} width={40} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line yAxisId="left" dataKey="effectif" type="monotone" stroke="var(--color-effectif)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            <Line yAxisId="right" dataKey="recrutements" type="monotone" stroke="var(--color-recrutements)" strokeWidth={2} dot={false} />
            <Line yAxisId="right" dataKey="departs" type="monotone" stroke="var(--color-departs)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </ChartCard>
      <SmartCards loading={loading} />
    </div>
  )
}
