'use client'

import { UserPlus, CalendarClock, Palmtree, Building2, MapPin } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
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
import { EmployeeDashboard } from '@/types/dashboard'

const palette = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

const sexeConfig = {
  Hommes: { label: 'Hommes', color: 'var(--chart-1)' },
  Femmes: { label: 'Femmes', color: 'var(--chart-2)' },
} satisfies ChartConfig

const agenceConfig = { employes: { label: 'Employés', color: 'var(--chart-1)' } } satisfies ChartConfig
const statutConfig = { valeur: { label: 'Employés', color: 'var(--chart-2)' } } satisfies ChartConfig

type Props = {
  loading: boolean
  data?: EmployeeDashboard
}

export function EmployesSection({ loading, data }: Props) {
  const k = data
  const departements =
    data?.parDepartement.map(item => ({
      departement: item.label,
      employes: item.value,
    })) ?? []

  const agences =
    data?.parAgence.map(item => ({
      agence: item.label,
      employes: item.value,
    })) ?? []

  const sexes =
    data?.parSexe.map(item => ({
      sexe: item.label,
      valeur: item.value,
    })) ?? []

  const contrats =
    data?.parContrat.map(item => ({
      contrat: item.label,
      valeur: item.value,
    })) ?? []

  const statuts =
    data?.parStatut.map(item => ({
      statut: item.label,
      valeur: item.value,
    })) ?? []

  const totalEmployes = departements.reduce(
    (sum, item) => sum + item.employes,
    0
  )

  const deptConfig = departements.reduce((acc, d, i) => {
    acc[d.departement] = {
      label: d.departement,
      color: palette[i % palette.length],
    }
    return acc
  }, {} as ChartConfig)

  const contratConfig = contrats.reduce((acc, d, i) => {
    acc[d.contrat] = {
      label: d.contrat,
      color: palette[i % palette.length],
    }
    return acc
  }, {} as ChartConfig)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          loading={loading}
          index={0}
          label="Nouveaux ce mois"
          value={k?.nouveauxCeMois ?? 0}
          icon={UserPlus}
          tone="success"
          trend={{
            value: Math.abs(k?.evolutionNouveauxEmployes ?? 0),
            positif: (k?.evolutionNouveauxEmployes ?? 0) >= 0
          }}
        />
        <KpiCard
          loading={loading}
          index={1}
          label="Ancienneté moyenne"
          value={k?.ancienneteMoyenne ?? 0}
          suffix="ans"
          icon={CalendarClock}
          tone="primary"
          trend={{
            value: Math.abs(k?.evolutionAnciennete ?? 0),
            positif: (k?.evolutionAnciennete ?? 0) >= 0
          }}
        />
        <KpiCard loading={loading} index={2} label="Solde moyen de congé" value={k?.soldeMoyenConge ?? 0} suffix="j" icon={Palmtree} tone="warning" />
        <KpiCard loading={loading} index={3} label="Départements" value={k?.nombreDepartements ?? 0} icon={Building2} tone="neutral" />
        <KpiCard loading={loading} index={4} label="Agences" value={k?.nombreAgences ?? 0} icon={MapPin} tone="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard loading={loading} index={0} title="Répartition par département" description="Effectif par département">
          <ChartContainer config={deptConfig} className="mx-auto aspect-square max-h-[280px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="departement" />} />
              <Pie data={departements} dataKey="employes" nameKey="departement" innerRadius={62} strokeWidth={4}>
                {departements.map((d, i) => (
                  <Cell key={d.departement} fill={palette[i % palette.length]} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-semibold">
                            {totalEmployes.toLocaleString('fr-FR')}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 20} className="fill-muted-foreground text-xs">
                            Employés
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="departement" />} className="flex-wrap gap-2" />
            </PieChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard loading={loading} index={1} title="Répartition par agence" description="Effectif par agence">
          <ChartContainer config={agenceConfig} className="h-[280px] w-full">
            <BarChart data={agences} layout="vertical" margin={{ left: 16, right: 16 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="agence"
                tickLine={false}
                axisLine={false}
                width={140}
                tickFormatter={(value: string) =>
                  value.length > 18 ? `${value.slice(0, 18)}…` : value
                }
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="employes" fill="var(--color-employes)" radius={6} barSize={26} />
            </BarChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard loading={loading} index={2} title="Répartition par sexe" description="Hommes / Femmes">
          <ChartContainer config={sexeConfig} className="mx-auto aspect-square max-h-[260px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="sexe" />} />
              <Pie data={sexes} dataKey="valeur" nameKey="sexe" strokeWidth={4}>
                <Cell fill="var(--chart-1)" />
                <Cell fill="var(--chart-2)" />
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="sexe" />} />
            </PieChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard loading={loading} index={3} title="Répartition par type de contrat" description="CDI, CDD, Stage, Freelance">
          <ChartContainer config={contratConfig} className="mx-auto aspect-square max-h-[260px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="contrat" />} />
              <Pie data={contrats} dataKey="valeur" nameKey="contrat" innerRadius={58} strokeWidth={4}>
                {contrats.map((d, i) => (
                  <Cell key={d.contrat} fill={palette[i % palette.length]} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="contrat" />} className="flex-wrap gap-2" />
            </PieChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard loading={loading} index={4} title="Répartition par statut" description="Statut des employés" className="lg:col-span-2">
          <ChartContainer config={statutConfig} className="h-[260px] w-full">
            <BarChart data={statuts} margin={{ left: 4, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="statut" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="valeur" radius={8} barSize={64}>
                {statuts.map((d, i) => (
                  <Cell key={d.statut} fill={palette[i % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  )
}