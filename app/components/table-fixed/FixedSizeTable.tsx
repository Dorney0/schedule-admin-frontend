import React from 'react';
import './fixedsizetable.css';

interface FixedSizeTableProps {
    columns: string[];
    data: any[];
    renderRow?: (item: any, index: number) => React.ReactNode;
}

const FixedSizeTable: React.FC<FixedSizeTableProps> = ({ columns, data, renderRow }) => {
    const wrapperClass = data.length === 0 ? "table-wrapper empty" : "table-wrapper";

    return (
        <div className={wrapperClass}>
            <table className="table">
                <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col}>{col}</th>
                    ))}
                    <th className="actions">Действия</th>
                </tr>
                </thead>
                <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length + 1} className="empty">
                            Данные отсутствуют
                        </td>
                    </tr>
                ) : (
                    data.map((item, i) =>
                        renderRow ? (
                            <React.Fragment key={i}>{renderRow(item, i)}</React.Fragment>
                        ) : (
                            <tr key={item.id ?? i}>
                                {columns.map((col, idx) => (
                                    <td key={idx}>{item[col]?.toString() ?? ''}</td>
                                ))}
                                <td>{/* Тут кнопки действий */}</td>
                            </tr>
                        )
                    )
                )}
                </tbody>
            </table>
        </div>
    );
};

export default FixedSizeTable;
