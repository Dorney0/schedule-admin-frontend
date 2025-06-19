import React, { useEffect, useState } from 'react';
import './RequestPage.css';
import { RequestStatus, RequestStatusRu } from '~/enums/RequestEnums';
interface Request {
    id: number;
    senderId: number;
    receiverId: number;
    status: RequestStatus;
    schedulePhotos: string[];
}

export default function RequestPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);
    const [newStatus, setNewStatus] = useState<string>('');

    const fetchRequests = async () => {
        try {
            const res = await fetch('http://localhost:5252/api/Requests');
            if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error('Ошибка загрузки заявок:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const openRequest = (req: Request) => {
        setSelectedRequest(req);
        setNewStatus(req.status);
    };

    const updateStatus = async () => {
        if (!selectedRequest) return;

        try {
            const res = await fetch(`http://localhost:5252/api/Requests/${selectedRequest.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...selectedRequest, status: newStatus }),
            });
            if (!res.ok) throw new Error(`Ошибка обновления: ${res.status}`);

            alert('Статус обновлён');
            setSelectedRequest(null);
            fetchRequests();
        } catch (error) {
            alert('Ошибка при обновлении статуса');
            console.error(error);
        }
    };

    return (
        <div className="request-page">
            <h1 className="page-title">Заявки на утверждение расписания</h1>

            {requests.length === 0 && <p className="no-requests">Нет заявок для отображения.</p>}

            <div className="request-list">
                {requests.map(req => (
                    <div
                        key={req.id}
                        className="request-item"
                        onClick={() => openRequest(req)}
                        tabIndex={0}
                        role="button"
                        onKeyDown={e => { if(e.key === 'Enter') openRequest(req); }}
                    >
                        <div className="request-info">
                            <span className="request-id">Заявка #{req.id}</span>
                            <span className="request-sender">Отправитель ID: {req.senderId}</span>
                            <span className={`request-status status-${req.status.toLowerCase()}`}>
                {RequestStatusRu[req.status]}
              </span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedRequest && (
                <div className="modal-overlay" onClick={() => setSelectedRequest(null)} role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 id="modalTitle" className="modal-title">Заявка #{selectedRequest.id}</h2>

                        <div className="modal-section">
                            <strong>Отправитель ID:</strong> {selectedRequest.senderId}
                        </div>
                        <div className="modal-section">
                            <strong>Получатель ID:</strong> {selectedRequest.receiverId}
                        </div>

                        <div className="modal-section">
                            <label htmlFor="status-select"><strong>Статус:</strong></label>
                            <select
                                id="status-select"
                                value={newStatus}
                                onChange={e => setNewStatus(e.target.value)}
                                className="status-select"
                            >
                                <option value="new">Новая</option>
                                <option value="in_progress">В процессе</option>
                                <option value="approved">Утверждена</option>
                                <option value="rejected">Отклонена</option>
                            </select>
                            <button onClick={updateStatus} className="btn-update-status" type="button">
                                Обновить статус
                            </button>
                        </div>

                        <div className="modal-section photos-section">
                            <strong>Фото расписания:</strong>
                            {selectedRequest.schedulePhotos.length === 0 ? (
                                <p className="no-photos">Нет фото</p>
                            ) : (
                                <div className="photos-container">
                                    {selectedRequest.schedulePhotos.map((url, i) => (
                                        <img
                                            key={i}
                                            src={url}
                                            alt={`Фото расписания ${i + 1}`}
                                            onClick={() => setZoomedPhoto(url)}
                                            className="photo-thumb"
                                            tabIndex={0}
                                            role="button"
                                            onKeyDown={e => { if(e.key === 'Enter') setZoomedPhoto(url); }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <button onClick={() => setSelectedRequest(null)} className="btn-close-modal" type="button">
                            Закрыть
                        </button>
                    </div>
                </div>
            )}

            {zoomedPhoto && (
                <div className="modal-overlay" onClick={() => setZoomedPhoto(null)} role="dialog" aria-modal="true">
                    <div className="zoomed-photo-container" onClick={e => e.stopPropagation()}>
                        <img src={zoomedPhoto} alt="Увеличенное фото" className="zoomed-photo" />
                        <button onClick={() => setZoomedPhoto(null)} className="btn-close-photo" aria-label="Закрыть фото">&times;</button>
                    </div>
                </div>
            )}
        </div>
    );
}
