import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DropdownOption {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    divider?: boolean;
    restricted?: boolean;
}

interface SettingsDropdownProps {
    onSettingsClick: () => void;
    onOpenCanaux: () => void;
    onOpenAffectation: () => void;
    userRole?: string;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({ onSettingsClick, onOpenAffectation, userRole }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);
    const isSuperAdmin = userRole === "SUPER ADMIN";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const dropdownOptions: DropdownOption[] = [
        {
            icon: <i className="ri-settings-line text-lg"></i>,
            label: 'Settings',
            onClick: () => {
                router.push('/settings');
                closeDropdown();
            },
            divider: true,
            restricted: true,
        },
        {
            icon: <i className="ri-user-settings-line text-lg"></i>,
            label: 'User settings',
            onClick: () => {
                onSettingsClick();
                closeDropdown();
            },
            restricted: true,
        },
        {
            icon: <i className="ri-notification-line text-lg"></i>,
            label: 'Historique',
            onClick: () => {
                onOpenAffectation();
                closeDropdown();
            },
            restricted: true,
        },
    ];


    return (
        <div className="relative inline-block">
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className={`
                    w-10 h-10 flex items-center justify-center
                    rounded-full transition-all duration-200 ease-in-out
                    ${isOpen
                        ? 'bg-gray-100 text-gray-700 scale-105 rotate-45'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                    }
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                    active:scale-95
                `}
                aria-label="Settings menu"
                aria-expanded={isOpen}
            >
                <i className={`ri-settings-5-line text-xl transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}></i>
            </button>

            <div
                ref={dropdownRef}
                className={`
                    absolute right-0 mt-5 w-56 z-50
                    transition-all duration-200 ease-in-out origin-top-right
                    ${isOpen
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }
                `}
            >
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 overflow-hidden">
                    {dropdownOptions.map((option, index) => {
                        const isRestricted =
                            !isSuperAdmin &&
                            (option.label === "Historique" || option.label === "User settings");
                        return (
                            <React.Fragment key={index}>
                                <button
                                    onClick={() => {
                                        if (isRestricted) return;
                                        option.onClick();
                                    }}
                                    className={`
                    w-full px-4 py-2.5 text-left flex items-center gap-3
                    transition-colors duration-150 ease-in-out

                    ${isRestricted
                                            ? "text-gray-300 cursor-not-allowed opacity-60 pointer-events-none"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                        }
                `}
                                >
                                    <span className="text-gray-500">{option.icon}</span>
                                    <span className="font-medium text-sm">{option.label}</span>
                                </button>

                                {option.divider && <div className="my-1 border-t border-gray-100"></div>}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SettingsDropdown;
