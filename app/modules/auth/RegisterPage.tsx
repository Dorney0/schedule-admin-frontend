import React, { useState } from 'react';
import {
    registerUser,
} from '../../api/auth';
import './LoginPage.css';
import { useAuth } from "~/modules/auth/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

export function LoginPage() {
    const [regLogin, setRegLogin] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regFullName, setRegFullName] = useState('');
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    const register = async () => {
        try {
            await registerUser(regLogin, regPassword, regFullName);
            console.log('✅ Регистрация прошла успешно');
            navigate('/auth', { replace: true });
        } catch (err: any) {
            console.error('❌ Ошибка регистрации:', err.response?.data || err.message);
        }
    };

    return (
        <div className="container">
            <div className="registration-header">
                <button
                    onClick={() => navigate('/auth')}
                    className="back-button"
                    aria-label="Назад к авторизации"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1>Регистрация</h1>
            </div>

            <div className="card">
                <input
                    placeholder="Логин"
                    value={regLogin}
                    onChange={(e) => setRegLogin(e.target.value)}
                />
                <input
                    placeholder="Полное имя"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                />
                <div className="auth-buttons">
                <button onClick={register} className="btn-register">Зарегистрироваться</button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
