'use client';

import React, { useState, useEffect } from 'react';
import { AppUser } from '@/types/users/user';
import Link from 'next/link';
import logo from "../../../public/logoMobileNIM.png"
import { usePathname } from 'next/navigation';
import { getUserProfile } from '@/api/dashboard/employee-and-user/users';
import {
  Calendar,
  PlusCircle,
  Users,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Briefcase,
  ClipboardList,
} from 'lucide-react';

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    key: 'nav-calendar',
    label: 'Calendrier',
    href: '/interview/interview-calendar',
    icon: <Calendar size={20} />,
    badge: 3,
  },
  {
    key: 'nav-create',
    label: 'Nouvel entretien',
    href: '/interview/interview-creation',
    icon: <PlusCircle size={20} />,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<AppUser | null>(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil utilisateur", error);
      }
    };

    fetchProfile();
  }, []);

  const getStatusColor = (status: string) =>
    status === "Agence Ambatolampy"
      ? "text-green-600 bg-green-50 py-2 px-4"
      : "text-red-800 bg-red-50 py-2 px-4";

  return (
    <aside
      className="relative flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex-shrink-0"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 overflow-hidden">
        <div className="flex items-center min-w-0">
          <div className="flex items-center space-x-4 ml-5">
            <img
              src={logo.src}
              alt="NIM Madagascar Logo"
              className="h-10 w-auto"
            />
            <span
              className={`inline-flex items-center
                                rounded-full text-[8px]
                                font-medium 
                                ${user ?
                  getStatusColor(user.agence.name) : ""
                }`}
            >
              {user?.agence?.name ?? "Aucune agence"}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-hidden">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '#' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.key}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 transition-all duration-150
                ${isActive
                  ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <span className={`flex-shrink-0 ${isActive ? 'text-green-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {!collapsed && item.badge !== undefined && (
                <span className="ml-auto flex-shrink-0 bg-green-100 text-green-700 text-[10px] font-700 rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge !== undefined && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full" />
              )}
              {/* Tooltip for collapsed */}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs rounded-md px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-100 py-3 px-2 space-y-0.5">
        <Link
          href="#"
          title={collapsed ? 'Notifications' : undefined}
          className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150"
        >
          <span className="flex-shrink-0 text-slate-500 group-hover:text-slate-700">
            <Bell size={20} />
          </span>
          {!collapsed && <span>Notifications</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs rounded-md px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
              Notifications
            </span>
          )}
        </Link>
        <Link
          href="#"
          title={collapsed ? 'Paramètres' : undefined}
          className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150"
        >
          <span className="flex-shrink-0 text-slate-500 group-hover:text-slate-700">
            <Settings size={20} />
          </span>
          {!collapsed && <span>Paramètres</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs rounded-md px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
              Paramètres
            </span>
          )}
        </Link>

        {/* User avatar */}
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <div className="flex justify-center items-center h-10 w-10">
                {user?.imageProfil ? (
                  <img
                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md"
                    src={user.imageProfil.url}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center">
                    <i className="ri-user-line text-lg text-gray-600"></i>
                  </div>
                )}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-600 text-slate-800 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.appRoles[0]?.roleName}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-1">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="flex justify-center items-center">
                {user?.imageProfil ? (
                  <img
                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md"
                    src={user.imageProfil.url}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center">
                    <i className="ri-user-line text-lg text-gray-600"></i>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-150 z-10"
        aria-label={collapsed ? 'Développer la sidebar' : 'Réduire la sidebar'}
      >
        {collapsed ? (
          <ChevronRight size={12} className="text-slate-500" />
        ) : (
          <ChevronLeft size={12} className="text-slate-500" />
        )}
      </button>
    </aside>
  );
}