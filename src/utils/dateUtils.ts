export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric'
    });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
};

export const getWeekDays = (startDate: Date): Date[] => {
    const days = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday

    for (let i = 0; i < 7; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        days.push(day);
    }

    return days;
};

export const getMonthDays = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add days from previous month to fill the first week
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = startDay - 1; i >= 0; i--) {
        const prevDay = new Date(year, month, -i);
        days.push(prevDay);
    }

    // Add all days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(new Date(year, month, day));
    }

    // Add days from next month to fill the last week
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
        days.push(new Date(year, month + 1, day));
    }

    return days;
};

export const getTimeSlots = (): string[] => {
    const slots = [];
    for (let hour = 7; hour <= 17; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < 17) {
            slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
    }
    return slots;
};

export const validateTimeRange = (startTime: string, endTime: string): boolean => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return startMinutes >= 7 * 60 && endMinutes <= 17 * 60 && startMinutes < endMinutes;
};