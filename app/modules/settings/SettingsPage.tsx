import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './Settings.css';
import FixedSizeTable from "~/components/table-fixed/FixedSizeTable";
import {RefreshCcw} from "lucide-react";

const ENTITIES = [
    'Cabinet', 'ChangeLog', 'Class', 'Curriculum', 'Employee',
    'Preference', 'Schedule', 'Subject', 'SubjectCabinet', 'SubjectEmployee'
] as const;
interface FullEntityFormProps extends EntityFormProps {
    fkData: Record<string, EntityItem[]>;
}
const ENTITY_SCHEMAS: Record<Entity, string[]> = {
    Cabinet: ['id', 'number', 'capacity'],
    ChangeLog: ['id', 'entity', 'changeType', 'description'],
    Class: ['id', 'name', 'employeeId', 'studentCount'],
    Curriculum: ['id', 'subjectId', 'classId'],
    Employee: ['id', 'fullName', 'position', 'email', 'phone'],
    Preference: ['id', 'employeeId', 'time', 'notes'],
    Schedule: ['id', 'employeeId', 'subjectId', 'cabinetId', 'classId','date','dayOfWeek','lessonNumber','durationMinutes'],
    Subject: ['id', 'title', 'description'],
    SubjectCabinet: ['id', 'subjectId', 'cabinetId'],
    SubjectEmployee: ['id', 'subjectId', 'employeeId'],
};

const ENTITY_NAMES_RU: Record<Entity, string> = {
    Cabinet: 'Кабинеты',
    ChangeLog: 'Журнал изменений',
    Class: 'Классы',
    Curriculum: 'Учебный план',
    Employee: 'Сотрудники',
    Preference: 'Предпочтения',
    Schedule: 'Расписание',
    Subject: 'Предметы',
    SubjectCabinet: 'Предметы в кабинетах',
    SubjectEmployee: 'Предметы у сотрудников',
};

const FK_FIELDS: Record<Entity, Record<string, Entity>> = {
    Cabinet: {},
    ChangeLog: {},
    Class: { employeeId: 'Employee' },
    Curriculum: { subjectId: 'Subject', classId: 'Class' },
    Employee: {},
    Preference: { employeeId: 'Employee' },
    Schedule: {
        employeeId: 'Employee',
        subjectId: 'Subject',
        cabinetId: 'Cabinet',
        classId: 'Class',
    },
    Subject: {},
    SubjectCabinet: { subjectId: 'Subject', cabinetId: 'Cabinet' },
    SubjectEmployee: { subjectId: 'Subject', employeeId: 'Employee' },
};


type Entity = typeof ENTITIES[number];
type Mode = 'view' | 'add' | 'edit';

type EntityItem = { [key: string]: any; id?: number | string };

interface EntityFormProps {
    entity: Entity;
    currentItem: EntityItem;
    onChange: (key: string, value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

const EntityForm: React.FC<FullEntityFormProps> = ({ entity, currentItem, onChange, onSubmit, onCancel, fkData }) => {
    const fkFields = FK_FIELDS[entity] || {};

    return (
        <form className="entity-form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
            {Object.entries(currentItem).map(([key, value]) => {
                const isRequired = key !== 'id';
                const label = (
                    <label style={{ color: isRequired ? 'red' : undefined }}>
                        {isRequired ? '* ' : ''}{key}
                    </label>
                );

                if (fkFields[key]) {
                    const options = fkData[key] || [];
                    return (
                        <div key={key}>
                            {label}
                            <select
                                value={value ?? ''}
                                onChange={(e) => onChange(key, e.target.value)}
                            >
                                <option value="">-- выберите --</option>
                                {options.map((opt: EntityItem) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.title || opt.name || opt.fullName || opt.id}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                }

                return (
                    <div key={key}>
                        {label}
                        <input
                            type="text"
                            value={value ?? ''}
                            onChange={(e) => onChange(key, e.target.value)}
                        />
                    </div>
                );
            })}
            <button type="submit">Сохранить</button>
            <button type="button" onClick={onCancel}>Отмена</button>
        </form>
    );
}


function apiBaseUrl(entity: Entity): string {
    const apiHost = 'http://localhost:5252';
    switch (entity) {
        case 'SubjectCabinet':
            return `${apiHost}/api/SubjectCabinet`;
        case 'SubjectEmployee':
            return `${apiHost}/api/SubjectEmployee`;
        default:
            return `${apiHost}/api/${entity}`;
    }
}

const SettingsPage: React.FC = () => {
    const [selectedEntity, setSelectedEntity] = useState<Entity>(ENTITIES[0]);
    const [items, setItems] = useState<EntityItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState<EntityItem | null>(null);
    const [mode, setMode] = useState<Mode>('view');
    const columns = ENTITY_SCHEMAS[selectedEntity];
    const [fkData, setFkData] = useState<Record<string, EntityItem[]>>({});

    useEffect(() => {
        const fkFields = FK_FIELDS[selectedEntity] || {};
        const entityNames = Object.values(fkFields);

        Promise.all(
            entityNames.map((ent) =>
                fetch(apiBaseUrl(ent)).then((r) => r.json())
            )
        ).then((results) => {
            const newFkData: Record<string, EntityItem[]> = {};
            Object.entries(fkFields).forEach(([fieldKey, ent], index) => {
                newFkData[fieldKey] = results[index];
            });
            setFkData(newFkData);
        });
    }, [selectedEntity]);

    function renderRow(item: EntityItem, i: number) {
        return (
            <tr key={item.id ?? i}>
                {columns.map((col) => (
                    <td key={col} style={{ border: '1px solid #ccc', padding: '6px' }}>
                        {item[col]?.toString() ?? ''}
                    </td>
                ))}
                <td style={{ border: '1px solid #ccc', padding: '6px' }}>

                    <div className="action-buttons">
                        <button className="edit-button" onClick={() => startEdit(item)}>Изменить</button>
                        <button className="delete-button" onClick={() => deleteItem(item)}>Удалить</button>
                    </div>

                </td>
            </tr>
        );
    }

    useEffect(() => {
        setLoading(true);
        fetch(apiBaseUrl(selectedEntity))
            .then((r) => r.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
                setEditingItem(null);
                setMode('view');
            })
            .catch(() => setLoading(false));
    }, [selectedEntity]);

    function startAdd() {
        // Создаём пустой объект с ключами из первого элемента или пустой
        const empty: EntityItem = {};
        if (items.length > 0) {
            Object.keys(items[0]).forEach((k) => (empty[k] = ''));
        }
        setEditingItem(empty);
        setMode('add');
    }

    function startEdit(item: EntityItem | null = null) {
        if (item) {
            setEditingItem(item);
            setMode('edit');
        } else {
            // Если есть данные — взять их ключи
            if (items.length) {
                let empty: EntityItem = {};
                Object.keys(items[0]).forEach(k => (empty[k] = ''));
                setEditingItem(empty);
            } else {
                // Если данных нет, создать пустой объект по схеме
                const keys = ENTITY_SCHEMAS[selectedEntity];
                let empty: EntityItem = {};
                keys.forEach(k => (empty[k] = ''));
                setEditingItem(empty);
            }
        }
    }

    function cancelEdit() {
        setEditingItem(null);
        setMode('view');
    }

    function handleChange(key: string, value: string) {
        if (editingItem) {
            setEditingItem({ ...editingItem, [key]: value });
        }
    }

    function saveItem() {
        if (!editingItem) return;

        const method = mode === 'edit' && editingItem.id ? 'PUT' : 'POST';
        let url = apiBaseUrl(selectedEntity);
        if (method === 'PUT' && editingItem.id) {
            url += `/${editingItem.id}`;
        }

        // Преобразуем нужные поля к числам, если редактируем расписание
        let dto: any = { ...editingItem };

        if (selectedEntity === 'Schedule') {
            const numberFields = ['employeeId', 'subjectId', 'cabinetId', 'classId', 'dayOfWeek', 'lessonNumber', 'durationMinutes', 'id'];
            numberFields.forEach((field) => {
                if (dto[field] !== undefined && dto[field] !== '') {
                    dto[field] = Number(dto[field]);
                } else {
                    dto[field] = null;
                }
            });
            dto.date = dto.date === '' ? null : dto.date;
        }

        const payload = { ...dto };

        console.log('Отправляем на сервер:', method, url);
        console.log('Данные:', payload);

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(async (r) => {
                if (!r.ok) {
                    let errorText = await r.text();
                    try {
                        const json = JSON.parse(errorText);
                        console.error('Ошибка от сервера (json):', json);
                        errorText = JSON.stringify(json, null, 2);
                    } catch {
                        console.error('Ошибка от сервера (текст):', errorText);
                    }
                    throw new Error(`Ошибка сохранения: ${r.status} ${r.statusText}\n${errorText}`);
                }
                const text = await r.text();
                return text ? JSON.parse(text) : null;
            })
            .then(() => fetch(apiBaseUrl(selectedEntity)))
            .then((r) => r.json())
            .then((data) => {
                setItems(data);
                console.log('Payload:', JSON.stringify(payload, null, 2));
                cancelEdit();
            })
            .catch((err) => {
                console.error('Ошибка при сохранении:', err.message);
                alert(err.message);
            });

    }


    function deleteItem(item: EntityItem) {
        if (!item.id) {
            alert('Не могу удалить: нет id');
            return;
        }
        if (!confirm('Удалить эту запись?')) return;

        let url = apiBaseUrl(selectedEntity) + `/${item.id}`;

        fetch(url, { method: 'DELETE' })
            .then((r) => {
                if (!r.ok) throw new Error('Ошибка удаления');
                return fetch(apiBaseUrl(selectedEntity));
            })
            .then((r) => r.json())
            .then((data) => setItems(data))
            .catch((err) => alert(err.message));
    }

    return (
        <div className="settings-container">
            <h1>Выберите таблицу для редактирования</h1>

            <div className="settings-header">
                <select
                    className="settings-select"
                    value={selectedEntity}
                    onChange={(e) => setSelectedEntity(e.target.value as Entity)}
                    disabled={mode !== 'view'}
                >
                    {ENTITIES.map((e) => (
                        <option key={e} value={e}>
                            {ENTITY_NAMES_RU[e]}
                        </option>
                    ))}
                </select>

                <button
                    className="refresh-button"
                    title="Обновить данные"
                    onClick={() => {
                        setLoading(true);
                        fetch(apiBaseUrl(selectedEntity))
                            .then((r) => r.json())
                            .then((data) => {
                                setItems(data);
                                setLoading(false);
                                setEditingItem(null);
                                setMode('view');
                            })
                            .catch(() => setLoading(false));
                    }}
                >
                    <RefreshCcw size={20} />
                </button>
            </div>

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <>

                    <FixedSizeTable columns={columns} data={items} renderRow={renderRow} />

                    <div className="add-button-wrapper">
                        <button className="settings-add-button" onClick={startAdd}>
                            Добавить {ENTITY_NAMES_RU[selectedEntity].slice(0, -1)}
                        </button>
                    </div>
                </>
            )}

            {(mode === 'add' || mode === 'edit') && editingItem && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{mode === 'add' ? 'Добавить' : 'Редактировать'} {ENTITY_NAMES_RU[selectedEntity].slice(0, -1)}</h2>
                        <EntityForm
                            entity={selectedEntity}
                            currentItem={editingItem}
                            onChange={handleChange}
                            onSubmit={saveItem}
                            onCancel={cancelEdit}
                            fkData={fkData}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default SettingsPage;