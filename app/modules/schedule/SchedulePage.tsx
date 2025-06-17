import { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { getWeeklySchedule } from '../../api/scheduleApi';
import type { ScheduleItem } from '../../api/scheduleApi';
import { compareClassNames } from '../../utils/classSort';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SchedulePage.css';

const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

function SchedulePage() {
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const tableRef = useRef<HTMLTableElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getWeeklySchedule().then(setSchedule);
    }, []);

    const classNames = Array.from(new Set(schedule.map(item => item.className))).sort(compareClassNames);

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

    const captureTable = async () => {
        if (!tableRef.current) return;
        const canvas = await html2canvas(tableRef.current);
        const imgData = canvas.toDataURL('image/png');
        navigate('/print', { state: { imgData } });
    };

    return (
        <div className="schedule-container">
            <h1 className="schedule-title">Расписание на неделю</h1>
            <button onClick={captureTable} className="schedule-button">
                Сделать скриншот таблицы
            </button>
            <div className="schedule-table-wrapper">
                <table ref={tableRef} className="schedule-table">
                    <thead>
                    <tr>
                        <th className="sticky-column">День недели</th>
                        {classNames.map(className => (
                            <th key={className}>{className}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {dayNames.map(day => (
                        <tr key={day}>
                            <td className="sticky-column day-cell">{day}</td>
                            {classNames.map(className => (
                                <td key={className}>
                                    {scheduleMap[day][className].length > 0 ? (
                                        <ul>
                                            {scheduleMap[day][className]
                                                .sort((a, b) => a.lessonNumber - b.lessonNumber)
                                                .map((item, idx) => (
                                                    <li key={idx}>
                                                        <div><strong>{item.lessonNumber}.</strong> {item.subjectName}</div>
                                                        <div className="item-meta">{item.employeeName}, {item.cabinetName}</div>
                                                    </li>
                                                ))}
                                        </ul>
                                    ) : (
                                        <div className="empty-cell">—</div>
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
