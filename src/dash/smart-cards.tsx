'use client'

import { motion } from 'motion/react'
import { Building2, MapPin, Megaphone, Palmtree, UserPlus, LogOut, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import "./dash.css"
import { SmartCards as SmartCardsDTO } from "@/types/dashboard";

type Smart = { icon: LucideIcon; label: string; nom: string; meta: string }
type Props = {
  loading: boolean;
  data?: SmartCardsDTO;
};
export function SmartCards({ loading, data }: Props) {
  const cards: Smart[] = [

    {
      icon: Building2,
      label: "Département le plus fourni",
      nom: data?.departementPlusEmployes ?? "-",
      meta: `${data?.nombreEmployesDepartement ?? 0} employés`
    },

    {
      icon: MapPin,
      label: "Agence la plus fournie",
      nom: data?.agencePlusEmployes ?? "-",
      meta: `${data?.nombreEmployesAgence ?? 0} employés`
    },

    {
      icon: Megaphone,
      label: "Département recrutant le plus",
      nom: data?.departementQuiRecrute ?? "-",
      meta: `${data?.nombreRecrutements ?? 0} recrutements`
    },

    {
      icon: Palmtree,
      label: "Département avec le plus de congés",
      nom: data?.departementPlusConges ?? "-",
      meta: `${data?.nombreConges ?? 0} congés`
    },

    {
      icon: UserPlus,
      label: "Employés recrutés ce mois",
      nom: String(data?.recrutesCeMois ?? 0),
      meta: "nouvelles arrivées"
    },

    {
      icon: LogOut,
      label: "Départs à venir (préavis)",
      nom: String(data?.preavis ?? 0),
      meta: "employés en préavis"
    }

  ];
  return (
    <section aria-label="Cartes RH intelligentes" className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground">Cartes RH intelligentes</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border/70">
              <CardContent className="flex items-center gap-4">
                <Skeleton className="size-11 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </CardContent>
            </Card>
          ))
          : cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: 'easeOut' }}
            >
              <Card className="group h-full border-border/70 shadow-sm transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <card.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-muted-foreground">{card.label}</p>
                    <p className="truncate text-lg font-semibold tracking-tight">{card.nom}</p>
                    <p className="truncate text-xs text-muted-foreground">{card.meta}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>
    </section>
  )
}
