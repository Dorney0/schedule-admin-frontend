import React, { useEffect, useState } from 'react';
import './PreferencesPage.css';
import { format } from 'date-fns';
import { useAuth } from '~/modules/auth/AuthContext';
import type { User } from '~/modules/auth/AuthContext';
import { X } from 'lucide-react';  // импорт иконки крестика

interface Preference {
    userId: number;
    time: string; // ISO string
    notes: string;
}

interface PreferenceExtended extends Preference {
    id: number;
}

export default function PreferencesPage() {
    const [tab, setTab] = useState<'form' | 'preferences'>('form');
    const [notes, setNotes] = useState('');
    const [preferences, setPreferences] = useState<PreferenceExtended[]>([]);
    const [selectedPreference, setSelectedPreference] = useState<PreferenceExtended | null>(null);

    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert('Пользователь не авторизован');

        const payload: Preference = {
            userId: Number(user.id),
            time: new Date().toISOString(),
            notes
        };

        const res = await fetch('http://localhost:5252/api/Preference', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('Предпочтение отправлено!');
            setNotes('');
        } else {
            alert('Ошибка отправки предпочтения.');
        }
    };

    const fetchPreferences = async () => {
        try {
            const res = await fetch('http://localhost:5252/api/Preference');
            if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
            const data = await res.json();
            setPreferences(data);
        } catch (error) {
            console.error('Ошибка при загрузке предпочтений:', error);
        }
    };

    useEffect(() => {
        if (tab === 'preferences') fetchPreferences();
    }, [tab]);

    const formatDateSafe = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '—';
        return format(date, 'dd.MM.yyyy HH:mm');
    };

    // Новый метод удаления
    const handleDelete = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить это предпочтение?')) return;

        try {
            const res = await fetch(`http://localhost:5252/api/Preference/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error(`Ошибка удаления: ${res.status}`);
            alert('Предпочтение удалено');
            setSelectedPreference(null);
            fetchPreferences(); // обновить список
        } catch (error) {
            alert('Ошибка при удалении предпочтения');
            console.error(error);
        }
    };

    return (
        <div className="preferences-page">
            <div className="tab-buttons">
                <button onClick={() => setTab('form')} className={tab === 'form' ? 'active' : ''}>
                    Оставить предпочтение
                </button>
                <button onClick={() => setTab('preferences')} className={tab === 'preferences' ? 'active' : ''}>
                    Предпочтения
                </button>
            </div>

            {tab === 'form' && (
                <form onSubmit={handleSubmit} className="preference-form">
                    <p>
                        <strong>Вы авторизованы как:</strong> {user?.fullName} (ID: {user?.id})
                    </p>
                    <label>
                        Предпочтения:
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} required />
                    </label>
                    <button type="submit">Отправить</button>
                </form>
            )}

            {tab === 'preferences' && (
                <div className="preferences-list">
                    {preferences.length === 0 && <p>Нет предпочтений для отображения.</p>}
                    {preferences
                        .slice()
                        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                        .map((p) => (
                            <div key={p.id} className="preference-item" onClick={() => setSelectedPreference(p)}>
                                <strong>ID: {p.id}</strong> — Пользователь ID: {p.userId} — Время: {formatDateSafe(p.time)}
                            </div>
                        ))}
                </div>
            )}

            {selectedPreference && (
                <div className="modal-overlay" onClick={() => setSelectedPreference(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                        {/* Крестик для удаления */}
                        <button
                            className="modal-delete-button"
                            onClick={() => handleDelete(selectedPreference.id)}
                            title="Удалить предпочтение"
                            aria-label="Удалить предпочтение"
                        >
                            <X size={100} color="red" />
                        </button>

                        <h3>Предпочтение #{selectedPreference.id}</h3>
                        <p>
                            <strong>Пользователь ID:</strong> {selectedPreference.userId}
                        </p>
                        <p>
                            <strong>Время:</strong> {formatDateSafe(selectedPreference.time)}
                        </p>
                        <p>
                            <strong>Заметки:</strong> {selectedPreference.notes}
                        </p>
                        <button onClick={() => setSelectedPreference(null)}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
}
