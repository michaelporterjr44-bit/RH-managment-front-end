import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface SidebarProps {
    activeItem: string;
    onItemSelect: (itemId: string) => void;
}

const menuItems = [
    {
        id: 'recrutement',
        label: 'Recrutement',
        icon: 'ri-user-line',
        children: [
            { id: 'recrutement-canaux', label: 'Canaux', icon: 'ri-radio-line' },
        ]
    },
    {
        id: 'pay',
        label: 'Pay',
        icon: 'ri-money-dollar-circle-line',
        children: [
            { id: 'pay-account', label: 'Account', icon: 'ri-wallet-3-line' },
            { id: 'pay-codebank', label: 'Code Bank', icon: 'ri-bank-line' },
            { id: 'base-salary', label: 'Base Salary', icon: 'ri-funds-box-line' },
            { id: 'complements-salaire', label: 'Complements Salaire', icon: 'ri-increase-decrease-line' }
        ]
    }
];

export function Sidebar({ activeItem, onItemSelect }: SidebarProps) {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const parent = menuItems.find(item =>
            item.children?.some(child => child.id === activeItem)
        );
        if (parent) {
            setExpandedItems([parent.id]);
        }
    }, [activeItem]);


    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const isParentActive = (parentId: string) => {
        return activeItem.startsWith(parentId);
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0">
            <div className="flex items-center gap-2 justify-start p-6 border-b border-gray-100">
                <i className="ri-settings-5-line text-2xl"></i>
                <h1 className="text-lg font-semibold text-gray-900">Paramètres</h1>
            </div>

            <nav className="p-4">
                {menuItems.map((item) => {
                    const isExpanded = expandedItems.includes(item.id);
                    const isActive = isParentActive(item.id);

                    return (
                        <div key={item.id} className="mb-2">
                            <button
                               onClick={() => toggleExpanded(item.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-700'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <i className={`${item.icon} w-5 h-5 mr-3 text-lg text-gray-600`}></i>
                                    <span>{item.label}</span>
                                </div>
                                {isExpanded ? (
                                    <i className="ri-arrow-down-s-line w-4 h-4"></i>
                                ) : (
                                    <i className="ri-arrow-right-s-line w-4 h-4"></i>
                                )}
                            </button>

                            {isExpanded && item.children && (
                                <div className="ml-4 mt-1 space-y-1">
                                    {item.children.map((child) => (
                                        <button
                                            key={child.id}
                                            onClick={() => onItemSelect(child.id)}
                                            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors ${activeItem === child.id
                                                ? 'bg-green-100 text-green-700 font-medium'
                                                : 'text-gray-600'
                                                }`}
                                        >
                                            <i className={`${child.icon} w-4 h-4 mr-3 text-gray-600`}></i>
                                            <span>{child.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className='p-4 border-t border-black/20'>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                    <i className="ri-arrow-left-line w-4 h-4 mr-2"></i>
                    Dashboard
                </button>
            </div>
        </div>
    );
}
