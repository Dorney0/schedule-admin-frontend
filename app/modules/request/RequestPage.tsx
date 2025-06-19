import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RequestPage() {
    const location = useLocation();

    const navigate = useNavigate();

    // @ts-ignore
    const imgData = location.state?.imgData;

    if (!imgData) {
        return (
            <div className="print-page__container">
                <p>Нет изображения для печати.</p>
                <button className="btn-back" onClick={() => navigate(-1)}>Назад</button>
            </div>
        );
    }

    return (
        <div className="print-page__container">
            <h1 className="print-page__title">Печать расписания</h1>
            <img
                id="print-img"
                className="print-page__image"
                src={imgData}
                alt="Скриншот расписания"
            />
            <div className="print-page__buttons">
                <button className="btn-print" onClick={() => window.print()}>Печать</button>
                <button className="btn-back" onClick={() => navigate(-1)}>Назад</button>
            </div>
        </div>
    );
}

export default RequestPage;
