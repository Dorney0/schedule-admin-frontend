const API_BASE = 'http://localhost:5252/api';

// Определи интерфейс для элемента расписания
export interface ScheduleItem {
    day: string;
    classroom: string;
    subject: string;
}

// Функция возвращает Promise с массивом расписания
export async function getWeeklySchedule(): Promise<ScheduleItem[]> {
    const res = await fetch(`${API_BASE}/shedule`);
    if (!res.ok) {
        throw new Error('Failed to fetch schedule');
    }
    const data = await res.json();
    return data as ScheduleItem[];
}

// Функция принимает данные расписания для обновления и возвращает обновленный массив
export async function updateSchedule(data: ScheduleItem[]): Promise<ScheduleItem[]> {
    const res = await fetch(`${API_BASE}/shedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error('Failed to update schedule');
    }
    const updatedData = await res.json();
    return updatedData as ScheduleItem[];
}
