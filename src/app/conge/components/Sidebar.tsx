import { useState } from 'react';
import { useRouter } from 'next/navigation';

type SidebarProps = {
  currentView: string;
  onViewChange: (view: string) => void;
};

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

 const menuItems = [
  { id: 'new', label: 'Nouvelle Demande', icon: 'ri-add-circle-line' },
  { id: 'calendar', label: 'Calendrier', icon: 'ri-calendar-line' },
  { id: 'stats', label: 'Solde Congés', icon: 'ri-bar-chart-box-line' },
  { id: 'balance', label: 'Balance Congés', icon: 'ri-wallet-line' }, 
];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 
    transition-all duration-300 z-20 ${isCollapsed ? 'w-16' : 'w-64'}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <i
              className={`${isCollapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'
                } text-gray-600 text-xl`}
            ></i>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === item.id
                ? 'bg-green-50 text-green-700'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
              title={isCollapsed ? item.label : undefined}
            >
              <i className={`${item.icon} text-xl`}></i>
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </button>
          ))}
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

        <div className="p-4 border-t border-gray-200">
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${isCollapsed ? 'justify-center' : ''
              }`}
            title={isCollapsed ? 'Paramètres' : undefined}
          >
            <i className="ri-settings-3-line text-xl"></i>
            {!isCollapsed && <span className="font-medium text-sm">Paramètres</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
