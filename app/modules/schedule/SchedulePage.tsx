import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

import { getWeeklySchedule } from '../../api/scheduleApi';
import type { ScheduleItem } from '~/types/types'
import { compareClassNames } from '../../utils/classSort';
import { EditScheduleModal } from '~/components/modal/EditScheduleModal';
import './SchedulePage.css';

const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

function SchedulePage() {
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const tableRef = useRef<HTMLTableElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getWeeklySchedule().then(setSchedule);
    }, []);

    const handleCellClick = (day: string, className: string) => {
        setSelectedDay(day);
        setSelectedClass(className);
    };

    const reloadSchedule = async () => {
        const updated = await getWeeklySchedule();
        setSchedule(updated);
    };

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

        const wrapper = tableRef.current.closest('.schedule-table-wrapper');
        if (wrapper) {
            wrapper.scrollTop = 0; // Прокручиваем вверх
        }

        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(tableRef.current, {
            scrollY: -window.scrollY,
        });

        const imgData = canvas.toDataURL('image/png');
        navigate('/print', { state: { imgData } });
    };

    // Новая функция — скрин и отправка на утверждение
    const sendForApproval = async () => {
        if (!tableRef.current) {
            alert('Таблица расписания не найдена');
            return;
        }

        try {
            const wrapper = tableRef.current.closest('.schedule-table-wrapper');
            if (wrapper) {
                wrapper.scrollTop = 0;
            }
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(tableRef.current, {
                scrollY: -window.scrollY,
            });

            // Получаем base64 из canvas
            const imgData = canvas.toDataURL('image/png');

            // TODO: Здесь логика отправки изображения на сервер.
            // Пока для примера — просто POST с базовой информацией,
            // backend должен уметь принять base64 или нужно доработать загрузку.

            const requestBody = {
                id: 0,
                senderId: 1,   // TODO: заменить на ID текущего пользователя
                receiverId: 2, // TODO: заменить на ID директора
                status: 'submitted',
                schedulePhotos: [imgData], // или лучше — URL после загрузки
            };

            const res = await fetch('http://localhost:5252/api/Requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) {
                throw new Error(`Ошибка отправки: ${res.statusText}`);
            }

            alert('Расписание отправлено на утверждение директору');
        } catch (err) {
            alert(`Ошибка: ${(err as Error).message}`);
            console.error(err);
        }
    };

    return (
        <div className="schedule-container">
            <h1 className="schedule-title">Расписание на неделю</h1>

            <button onClick={captureTable} className="schedule-button">
                Сделать скриншот таблицы
            </button>
            <button onClick={reloadSchedule} className="schedule-button" style={{ marginLeft: 8 }}>
                Обновить данные
            </button>

            <button
                onClick={sendForApproval}
                className="schedule-button send-approval-button"
                title="Отправить расписание на утверждение директору"
            >
                Отправить на утверждение
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
                                <td
                                    key={className}
                                    onClick={() => handleCellClick(day, className)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {scheduleMap[day][className].length > 0 ? (
                                        <ul>
                                            {scheduleMap[day][className]
                                                .sort((a, b) => a.lessonNumber - b.lessonNumber)
                                                .map((item, idx) => (
                                                    <li key={idx}>
                                                        <div>
                                                            <strong>{item.lessonNumber}.</strong> {item.subjectName}
                                                        </div>
                                                        <div className="item-meta">
                                                            {item.employeeName}, {item.cabinetName}
                                                        </div>
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

            <EditScheduleModal
                visible={!!selectedDay && !!selectedClass}
                day={selectedDay ?? ''}
                class={selectedClass ?? ''}
                items={selectedDay && selectedClass ? scheduleMap[selectedDay][selectedClass] : []}
                onClose={() => {
                    setSelectedDay(null);
                    setSelectedClass(null);
                    reloadSchedule();
                }}
            />
        </div>
    );
}

export default SchedulePage;
