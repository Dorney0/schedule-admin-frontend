import { useEffect, useState } from 'react';
import { getWeeklySchedule } from '../../api/scheduleApi';
import type { ScheduleItem } from '../../api/scheduleApi';
import { compareClassNames } from '../../utils/classSort';

const dayNames = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
];

function SchedulePage() {
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

    useEffect(() => {
        getWeeklySchedule().then(setSchedule);
    }, []);

    // Получаем уникальные классы
    const classNames = Array.from(new Set(schedule.map(item => item.className))).sort(compareClassNames);

    // Группировка по дням и классам
    const scheduleMap: Record<string, Record<string, ScheduleItem[]>> = {};
    dayNames.forEach(day => {
        scheduleMap[day] = {};
        classNames.forEach(cls => {
            scheduleMap[day][cls] = [];
        });
    });

    schedule.forEach(item => {
        const day = dayNames[item.dayOfWeek - 1];
        if (scheduleMap[day] && scheduleMap[day][item.className]) {
            scheduleMap[day][item.className].push(item);
        }
    });

    return (
        <div>
            <h1>Расписание на неделю</h1>
            <div style={{
                overflow: 'auto',
                maxHeight: '600px',
                border: '1px solid #ccc'
            }}>
                <table style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f9f9f9', zIndex: 11 }}>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px', position: 'sticky', left: 0, backgroundColor: '#f9f9f9', zIndex: 10 }}>День недели</th>
                        {classNames.map(className => (
                            <th key={className} style={{ border: '1px solid #ccc', padding: '8px' }}>{className}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {dayNames.map(day => (
                        <tr key={day}>
                            <td style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 'bold', position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 9 }}>{day}</td>
                            {classNames.map(className => (
                                <td key={className} style={{ border: '1px solid #ccc', padding: '8px', verticalAlign: 'top' }}>
                                    {scheduleMap[day][className].length > 0 ? (
                                        <ul style={{ margin: 0, paddingLeft: '16px' }}>
                                            {scheduleMap[day][className]
                                                .sort((a, b) => a.lessonNumber - b.lessonNumber)
                                                .map((item, idx) => (
                                                    <li key={idx}>
                                                        <div><strong>{item.lessonNumber}.</strong> {item.subjectName}</div>
                                                        <div style={{ fontSize: '0.75em', color: '#555' }}>{item.employeeName}, {item.cabinetName}</div>
                                                    </li>
                                                ))}
                                        </ul>
                                    ) : (
                                        <div style={{ color: '#aaa', fontSize: '0.9em' }}>—</div>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SchedulePage;
