import { CalendarDays, Settings, Home, Printer } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const location = useLocation();

    const links = [
        { to: '/', label: 'Главная', icon: <Home size={20} /> },
        { to: '/schedule', label: 'Расписание', icon: <CalendarDays size={20} /> },
        { to: '/settings', label: 'Настройки', icon: <Settings size={20} /> },
        { to: '/print', label: 'Печать', icon: <Printer size={20} /> }, // новый пункт
    ];

    return (
        <aside className="sidebar">
            <h2>Навигация</h2>
            {links.map(({ to, label, icon }) => (
                <Link
                    key={to}
                    to={to}
                    className={`sidebar-link ${location.pathname === to ? 'active' : ''}`}
                >
                    {icon}
                    {label}
                </Link>
            ))}
        </aside>
    );
};

export default Sidebar;
