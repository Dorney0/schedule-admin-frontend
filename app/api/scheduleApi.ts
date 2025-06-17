import axios from 'axios';
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
    try {
        const res = await axios.get<ScheduleItem[]>(`${API_BASE}/Schedule`);
        return res.data;
    } catch (error) {
        throw new Error('Failed to fetch schedule');
    }
}
