import { useState, useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Leave } from '@/types/leave/leave.types';
import { mockHolidays } from '../mock/mockData';

type CustomCalendarProps = {
  onLeaveClick: (leave: Leave) => void;
  leaves: Leave[];
};

export default function CustomCalendar({
  leaves,
  onLeaveClick,
}: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  const getEventsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayLeaves = leaves.filter(
      (leave) =>
        new Date(leave.dateDebut) <= date && date <= new Date(leave.dateFin)
    );

    const dayHoliday = mockHolidays.find((h) => h.date === dateStr);

    return { dayLeaves, dayHoliday };
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'VALIDE':
        return { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-600' };
      case 'NEW':
        return { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-600' };
      case 'REFUSE':
        return { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-600' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Mois précédent"
            >
              <i className="ri-arrow-left-s-line text-xl text-gray-600"></i>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Mois suivant"
            >
              <i className="ri-arrow-right-s-line text-xl text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((dayName) => (
            <div
              key={dayName}
              className="bg-gray-50 border-b border-gray-200 p-3 text-center font-semibold text-sm text-gray-700"
            >
              {dayName}
            </div>
          ))}

          {weeks.map((week, weekIdx) =>
            week.map((day, dayIdx) => {
              const { dayLeaves, dayHoliday } = getEventsForDay(day);
              const isCurrent = isSameMonth(day, monthStart);

              return (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  className={`border-b border-gray-200 min-h-32 p-3 relative ${dayIdx < 6 ? 'border-r border-gray-200' : ''
                    } ${isCurrent ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <div
                    className={`text-sm font-semibold mb-2 ${isToday(day)
                      ? 'text-green-700 bg-green-100 w-7 h-7 flex items-center justify-center rounded-full'
                      : isCurrent
                        ? 'text-gray-900'
                        : 'text-gray-400'
                      }`}
                  >
                    {format(day, 'd')}
                  </div>

                  <div className="space-y-1.5 max-h-24 overflow-y-auto">
                    {dayHoliday && (
                      <div className="text-xs px-2 py-1.5 bg-blue-100 text-blue-800 rounded font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                        <i className="ri-flag-line mr-1"></i>
                        {dayHoliday.name}
                      </div>
                    )}

                    {dayLeaves.map((leave) => {
                      const color = getStateColor(leave.state);
                      const isStart = isSameDay(
                        new Date(leave.dateDebut),
                        day
                      );
                      const isEnd = isSameDay(
                        new Date(leave.dateFin),
                        day
                      );

                      return (
                        <button
                          key={leave.id}
                          onClick={() => onLeaveClick(leave)}
                          className={`flex items-center w-full text-left text-xs px-2 py-1.5 rounded font-medium whitespace-nowrap overflow-hidden text-ellipsis block ${color.bg} ${color.text} hover:shadow-md transition-shadow cursor-pointer`}
                          title={`${leave.employee?.firstName ?? "Inconnu"} - ${leave.motif}`}
                        >
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${color.dot}`}></span>
                          <div className="flex items-center gap-1">
                            <img
                              src={leave.employee.imageProfil?.url ||
                                `https://ui-avatars.com/api/?name=${leave.employee.firstName}+${leave.employee.lastName}`}
                              alt={`${leave.employee.lastName} ${leave.employee.firstName}`}
                              className="w-5 h-5 rounded-full object-cover border-2 border-white shadow-md"
                            />
                            {leave.employee?.firstName ?? "Inconnu"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm pt-4 justify-end items-start pr-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span className="text-gray-700">Validé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-600"></div>
            <span className="text-gray-700">En attente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-gray-700">Refusé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-gray-700">Jour férié</span>
          </div>
        </div>
      </div>
    </div>
  );
}
