'use client'

import { Palmtree, FileClock, CircleCheck, CircleX, Wallet } from 'lucide-react'
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
import { LeaveDashboard } from "@/types/dashboard";

const statutColors: Record<string, string> = {
  Validé: 'var(--chart-3)',
  'En attente': 'var(--chart-4)',
  Refusé: 'var(--chart-5)',
}

type Props = {
  loading: boolean;
  data?: LeaveDashboard;
};


export function CongesSection({ loading, data }: Props) {
  const k = data;
  const evolution =
    data?.evolution?.map(item => ({
      mois: item.mois,
      demandes: item.demandes,
    })) ?? [];

  const statut =
    data?.congesParStatut.map(item => ({
      statut: item.label,
      valeur: item.value,
    })) ?? [];

  const departement =
    data?.congesParDepartement.map(item => ({
      departement: item.label,
      valeur: item.value,
    })) ?? [];

  const statutConfig = statut.reduce((acc, d) => {

    acc[d.statut] = {

      label: d.statut,

      color: statutColors[d.statut] ?? "var(--chart-1)"

    };

    return acc;

  }, {} as ChartConfig);

  const evoConfig = {
    demandes: {
      label: "Demandes",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const deptConfig = {
    valeur: {
      label: "Congés",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          loading={loading}
          index={0}
          label="Actuellement en congé"
          value={k?.employesEnConge ?? 0}
          icon={Palmtree}
          tone="warning"
          trend={
            k
              ? {
                value: Math.abs(k.evolutionEmployesEnConge),
                positif: k.evolutionEmployesEnConge >= 0,
              }
              : undefined
          }
        />

        <KpiCard
          loading={loading}
          index={1}
          label="Demandes en attente"
          value={k?.demandesEnAttente ?? 0}
          icon={FileClock}
          tone="primary"
          hint="à valider"
          trend={
            k
              ? {
                value: Math.abs(k.evolutionDemandesEnAttente),
                positif: k.evolutionDemandesEnAttente >= 0,
              }
              : undefined
          }
        />

        <KpiCard
          loading={loading}
          index={2}
          label="Congés validés"
          value={k?.congesValides ?? 0}
          icon={CircleCheck}
          tone="success"
          trend={
            k
              ? {
                value: Math.abs(k.evolutionCongesValides),
                positif: k.evolutionCongesValides >= 0,
              }
              : undefined
          }
        />

        <KpiCard
          loading={loading}
          index={3}
          label="Congés refusés"
          value={k?.congesRefuses ?? 0}
          icon={CircleX}
          tone="destructive"
          trend={
            k
              ? {
                value: Math.abs(k.evolutionCongesRefuses),
                positif: k.evolutionCongesRefuses >= 0,
              }
              : undefined
          }
        />

        <KpiCard
          loading={loading}
          index={4}
          label="Solde moyen restant"
          value={k?.soldeMoyenRestant ?? 0}
          suffix="j"
          icon={Wallet}
          tone="neutral"
          trend={
            k
              ? {
                value: Math.abs(k.evolutionSoldeMoyen),
                positif: k.evolutionSoldeMoyen >= 0,
              }
              : undefined
          }
        />
      </div>

      <ChartCard loading={loading} title="Évolution mensuelle des demandes de congé" description="Nombre de demandes déposées par mois">
        <ChartContainer config={evoConfig} className="h-[300px] w-full">
          <AreaChart data={evolution} margin={{ left: 4, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="fillDemandes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-demandes)" stopOpacity={0.5} />
                <stop offset="95%" stopColor="var(--color-demandes)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="mois" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area dataKey="demandes" type="monotone" stroke="var(--color-demandes)" strokeWidth={2.5} fill="url(#fillDemandes)" />
          </AreaChart>
        </ChartContainer>
      </ChartCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard loading={loading} index={0} title="Répartition des congés par statut" description="Validé, en attente, refusé">
          <ChartContainer config={statutConfig} className="mx-auto aspect-square max-h-[280px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="statut" />} />
              <Pie data={statut} dataKey="valeur" nameKey="statut" innerRadius={62} strokeWidth={4}>
                {statut.map((d) => (
                  <Cell
                    key={d.statut}
                    fill={statutColors[d.statut] ?? "var(--chart-1)"}
                  />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="statut" />} className="flex-wrap gap-2" />
            </PieChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard loading={loading} index={1} title="Répartition des congés par département" description="Congés cumulés par département">
          <ChartContainer config={deptConfig} className="h-[280px] w-full">
            <BarChart data={departement} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="departement" tickLine={false} axisLine={false} width={110} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="valeur" fill="var(--color-valeur)" radius={6} barSize={22} />
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  )
}
