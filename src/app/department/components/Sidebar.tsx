'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import logo from "../../../../public/logoMobileNIM.png"
import { usePathname } from 'next/navigation';
import { AppUser } from '@/types/users/user';
import { getUserProfile } from '@/api/dashboard/employee-and-user/users';
import {
    LayoutDashboard,
    Building2,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    Bell,
    FileText,
    BarChart3,
} from 'lucide-react';


interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    badge?: number;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'nav-departments', label: 'Departments', href: '/department/department-list', icon: Building2},
    /*{ id: 'nav-employees', label: 'Employees', href: '/department-list', icon: Users },
    { id: 'nav-reports', label: 'Reports', href: '/department-list', icon: BarChart3 },
    { id: 'nav-documents', label: 'Documents', href: '/department-list', icon: FileText },*/
];

const BOTTOM_ITEMS: NavItem[] = [
    { id: 'nav-notifications', label: 'Notifications', href: '/department/department-list', icon: Bell},
    { id: 'nav-settings', label: 'Settings', href: '/department/department-list', icon: Settings },
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

    const isDepartmentActive = (href: string) => {
        if (href === '/department/department-list') {
            return pathname === '/department/department-list' || pathname?.startsWith('/department/department-detail');
        }
        return pathname === href;
    };

    return (
        <aside
            className={`
        relative flex flex-col bg-white border-r border-slate-200 shadow-sm
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? 'w-16' : 'w-60'}
      `}
            style={{ minHeight: '100vh' }}
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

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-16 z-10 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors duration-150"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? (
                    <ChevronRight size={12} className="text-slate-500" />
                ) : (
                    <ChevronLeft size={12} className="text-slate-500" />
                )}
            </button>

            {/* Main nav */}
            <nav className="flex-1 px-2 py-4 space-y-0.5">
                {!collapsed && (
                    <p className="px-3 mb-2 text-[10px] font-600 uppercase tracking-widest text-slate-400">
                        Main Menu
                    </p>
                )}
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isDepartmentActive(item.href);
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={`
                group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                transition-all duration-150 cursor-pointer
                ${active
                                    ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }
              `}
                        >
                            <Icon
                                size={18}
                                className={`flex-shrink-0 transition-colors duration-150 ${active ? 'text-green-700' : 'text-slate-400 group-hover:text-slate-600'}`}
                            />
                            {!collapsed && (
                                <>
                                    <span className="flex-1 whitespace-nowrap">{item.label}</span>
                                    {item.badge !== undefined && (
                                        <span className={`ml-auto text-[11px] font-600 px-1.5 py-0.5 rounded-full tabular-nums ${active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                            {collapsed && item.badge !== undefined && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 text-white text-[9px] font-700 rounded-full flex items-center justify-center tabular-nums">
                                    {item.badge}
                                </span>
                            )}
                            {/* Tooltip for collapsed */}
                            {collapsed && (
                                <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom nav */}
            <div className="px-2 py-3 border-t border-slate-100 space-y-0.5">
                {BOTTOM_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-150 cursor-pointer"
                        >
                            <Icon size={18} className="flex-shrink-0 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            {!collapsed && (
                                <>
                                    <span className="flex-1 whitespace-nowrap">{item.label}</span>
                                    {item.badge !== undefined && (
                                        <span className="ml-auto text-[11px] font-600 px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 tabular-nums">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                            {collapsed && item.badge !== undefined && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-700 rounded-full flex items-center justify-center tabular-nums">
                                    {item.badge}
                                </span>
                            )}
                            {collapsed && (
                                <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}

                {/* User avatar */}
                <div className={`mt-3 flex items-center gap-3 rounded-lg px-3 py-2.5 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-700 flex-shrink-0">
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
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="text-xs font-600 text-slate-800 truncate">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[10px] text-slate-400 truncate">{user?.appRoles[0]?.roleName}</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}