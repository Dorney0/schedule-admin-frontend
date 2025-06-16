export interface ScheduleItem {
    id: number;
    dayOfWeek: number;
    lessonNumber: number;
    durationMinutes: number;
    className: string;
    cabinetName: string;
    subjectName: string;
    employeeName: string;
}

const API_BASE = 'http://localhost:5252/api';

export async function getWeeklySchedule(): Promise<ScheduleItem[]> {
    const res = await fetch(`${API_BASE}/Schedule`);
    if (!res.ok) throw new Error('Failed to fetch schedule');
    return await res.json();
}


// Функция принимает данные расписания для обновления и возвращает обновленный массив
export async function updateSchedule(data: ScheduleItem[]): Promise<ScheduleItem[]> {
    const res = await fetch(`${API_BASE}/Schedule`, {
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
