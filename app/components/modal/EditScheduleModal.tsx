import React, { useEffect, useState } from 'react';
import type { ScheduleItem } from '~/types/types';
import './EditScheduleModal.css';

interface Subject {
    id: number;
    title: string;
}

interface Employee {
    id: number;
    fullName: string;
}

interface Cabinet {
    id: number;
    number: string;
}

interface EditScheduleModalProps {
    visible: boolean;
    day: string;
    class: string;
    items: ScheduleItem[];
    onClose: () => void;
}

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
                                                                        visible,
                                                                        day,
                                                                        class: className,
                                                                        items,
                                                                        onClose,
                                                                    }) => {
    const [editedItems, setEditedItems] = useState<ScheduleItem[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [cabinets, setCabinets] = useState<Cabinet[]>([]);

    useEffect(() => {
        setEditedItems(items);
    }, [items]);

    useEffect(() => {
        fetch('http://localhost:5252/api/Subject').then(res => res.json()).then(setSubjects);
        fetch('http://localhost:5252/api/Employee').then(res => res.json()).then(setEmployees);
        fetch('http://localhost:5252/api/Cabinet').then(res => res.json()).then(setCabinets);
    }, []);

    const handleChange = (index: number, field: keyof ScheduleItem, value: string | number) => {
        const updated = [...editedItems];
        updated[index] = { ...updated[index], [field]: value };
        setEditedItems(updated);
    };

    const handleSave = async () => {
        for (let i = 0; i < items.length; i++) {
            const original = items[i];
            const edited = editedItems[i];

            if (
                original.subjectId !== edited.subjectId ||
                original.employeeId !== edited.employeeId ||
                original.cabinetId !== edited.cabinetId
            ) {
                await fetch(`http://localhost:5252/api/Schedule/${edited.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subjectId: edited.subjectId,
                        employeeId: edited.employeeId,
                        cabinetId: edited.cabinetId,
                        classId: edited.classId,
                        date: edited.date,
                        dayOfWeek: edited.dayOfWeek,
                        lessonNumber: edited.lessonNumber,
                        durationMinutes: edited.durationMinutes,
                    }),
                });
            }
        }
        onClose();
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Удалить эту запись?')) return;

        const res = await fetch(`http://localhost:5252/api/Schedule/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setEditedItems(prev => prev.filter(item => item.id !== id));
        } else {
            alert('Ошибка при удалении');
        }
    };

    if (!visible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>
                    Редактировать расписание: {day}, {className}
                </h2>
                <table className="edit-table">
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Предмет</th>
                        <th>Преподаватель</th>
                        <th>Кабинет</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {editedItems.map((item, index) => (
                        <tr key={item.id}>
                            <td>{item.lessonNumber}</td>
                            <td>
                                <select
                                    value={item.subjectId}
                                    onChange={e => handleChange(index, 'subjectId', Number(e.target.value))}
                                >
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.title}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <select
                                    value={item.employeeId}
                                    onChange={e => handleChange(index, 'employeeId', Number(e.target.value))}
                                >
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.fullName}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <select
                                    value={item.cabinetId}
                                    onChange={e => handleChange(index, 'cabinetId', Number(e.target.value))}
                                >
                                    {cabinets.map(cab => (
                                        <option key={cab.id} value={cab.id}>
                                            {cab.number}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <button
                                    className="btn-delete"
                                    onClick={() => handleDelete(item.id)}
                                    title="Удалить запись"
                                >
                                    ×
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="modal-actions">
                    <button className="btn-save" onClick={handleSave}>
                        Сохранить
                    </button>
                    <button className="btn-cancel" onClick={onClose}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};
