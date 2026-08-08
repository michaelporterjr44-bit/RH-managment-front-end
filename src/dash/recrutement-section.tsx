'use client'

import { Megaphone, Users, CalendarCheck, UserCheck } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'
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
import "./dash.css"
import { RecruitmentDashboard } from '@/types/dashboard'

const palette = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

const evoConfig = {
  postulants: { label: 'Postulants', color: 'var(--chart-1)' },
  recrutes: { label: 'Recrutés', color: 'var(--chart-3)' },
} satisfies ChartConfig

type Props = {
  loading: boolean
  data?: RecruitmentDashboard
}

const niveauConfig = { valeur: { label: 'Postulants', color: 'var(--chart-2)' } } satisfies ChartConfig
const agenceConfig = { valeur: { label: 'Recrutés', color: 'var(--chart-3)' } } satisfies ChartConfig

export function RecrutementSection({ loading, data }: Props) {
  const k = data
  const evolution = data?.evolution ?? [];

  const postulantsStatut =
    data?.postulantsParStatut.map(item => ({
      statut: item.label,
      valeur: item.value,
    })) ?? []

  const postulantsNiveau =
    data?.postulantsParNiveau.map(item => ({
      niveau: item.label,
      valeur: item.value,
    })) ?? []

  const recrutementAgence =
    data?.recrutementParAgence.map(item => ({
      agence: item.label,
      valeur: item.value,
    })) ?? []

  const statutConfig = postulantsStatut.reduce((acc, d, i) => {
    acc[d.statut] = {
      label: d.statut,
      color: palette[i % palette.length],
    }
    return acc
  }, {} as ChartConfig)


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard loading={loading} index={0} label="Campagnes actives" value={k?.campagnesActives ?? 0} icon={Megaphone} tone="primary" hint={`Taux de conversion : ${k?.tauxConversion ?? 0}%`} />
        <KpiCard loading={loading} index={1} label="Total postulants" value={k?.totalPostulants ?? 0} icon={Users} tone="neutral" trend={{
    value: Math.abs(k?.evolutionPostulants ?? 0),
    positif: (k?.evolutionPostulants ?? 0) >= 0
}}/>
        <KpiCard loading={loading} index={3} label="Candidats recrutés" value={k?.candidatsRecrutes ?? 0} icon={UserCheck} tone="success" trend={{
    value: Math.abs(k?.evolutionRecrutements ?? 0),
    positif: (k?.evolutionRecrutements ?? 0) >= 0
}} />
        <KpiCard
          loading={loading}
          index={2}
          label="Entretiens programmés"
          value={k?.entretiensProgrammes ?? 0}
          icon={CalendarCheck}
          tone="warning"
          hint="à venir"
        />
      </div>

      <ChartCard loading={loading} title="Évolution des recrutements" description="Postulants et recrutés sur 12 mois">
        <ChartContainer config={evoConfig} className="h-[300px] w-full">
          <AreaChart data={evolution} margin={{ left: 4, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="fillPostulants" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-postulants)" stopOpacity={0.5} />
                <stop offset="95%" stopColor="var(--color-postulants)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillRecrutes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-recrutes)" stopOpacity={0.5} />
                <stop offset="95%" stopColor="var(--color-recrutes)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="mois" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area dataKey="postulants" type="monotone" stroke="var(--color-postulants)" strokeWidth={2} fill="url(#fillPostulants)" />
            <Area dataKey="recrutes" type="monotone" stroke="var(--color-recrutes)" strokeWidth={2} fill="url(#fillRecrutes)" />
          </AreaChart>
        </ChartContainer>
      </ChartCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard loading={loading} index={0} title="Postulants par statut" description="Pipeline de candidatures">
          <ChartContainer config={statutConfig} className="mx-auto aspect-square max-h-[260px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="statut" />} />
              <Pie data={postulantsStatut} dataKey="valeur" nameKey="statut" innerRadius={54} strokeWidth={4}>
                {postulantsStatut.map((d, i) => (
                  <Cell key={d.statut} fill={palette[i % palette.length]} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="statut" />} className="flex-wrap gap-2" />
            </PieChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard loading={loading} index={1} title="Postulants par niveau" description="Niveau d'études">
          <ChartContainer config={niveauConfig} className="h-[260px] w-full">
            <BarChart data={postulantsNiveau} margin={{ left: 4, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="niveau" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="valeur" fill="var(--color-valeur)" radius={6} barSize={40} />
            </BarChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard loading={loading} index={2} title="Recrutements par agence" description="Recrutés par agence">
          <ChartContainer config={agenceConfig} className="h-[260px] w-full">
            <BarChart data={recrutementAgence} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="agence" tickLine={false} axisLine={false} width={92} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="valeur" fill="var(--color-valeur)" radius={6} barSize={24} />
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  )
}
