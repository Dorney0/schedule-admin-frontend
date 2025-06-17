import React, { useEffect, useState } from 'react';
import './EditScheduleModal.css';
interface ScheduleItem {
    id: number;
    lessonNumber: number;
    subjectId: number;
    employeeId: number;
    cabinetId: number;
    classId: number;
    date: string;
    dayOfWeek: string;
    durationMinutes: number;
}

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
        fetch('http://localhost:5252/api/Subject')
            .then(res => res.json())
            .then(setSubjects);
        fetch('http://localhost:5252/api/Employee')
            .then(res => res.json())
            .then(setEmployees);
        fetch('http://localhost:5252/api/Cabinet')
            .then(res => res.json())
            .then(setCabinets);
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

            // Отправляем только если есть изменения
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
                        durationMinutes: edited.durationMinutes
                    })
                });
            }
        }
        onClose();
    };

    if (!visible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Редактировать расписание: {day}, {className}</h2>
                <table className="edit-table">
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Предмет</th>
                        <th>Преподаватель</th>
                        <th>Кабинет</th>
                    </tr>
                    </thead>
                    <tbody>
                    {editedItems.map((item, index) => (
                        <tr key={item.id}>
                            <td>{item.lessonNumber}</td>
                            <td>
                                <select
                                    value={item.subjectId}
                                    onChange={(e) => handleChange(index, 'subjectId', Number(e.target.value))}
                                >
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>{subject.title}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <select
                                    value={item.employeeId}
                                    onChange={(e) => handleChange(index, 'employeeId', Number(e.target.value))}
                                >
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <select
                                    value={item.cabinetId}
                                    onChange={(e) => handleChange(index, 'cabinetId', Number(e.target.value))}
                                >
                                    {cabinets.map(cab => (
                                        <option key={cab.id} value={cab.id}>{cab.number}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="modal-actions">
                    <button className="btn-save" onClick={handleSave}>Сохранить</button>
                    <button className="btn-cancel" onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
};
