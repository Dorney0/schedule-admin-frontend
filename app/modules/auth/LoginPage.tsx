import React, { useState } from 'react'
import {
    loginUser as loginUserApi,
    getMe as getMeApi,
} from '../../api/auth'
import './LoginPage.css'
import { useAuth } from "./AuthContext";
import {useNavigate} from "react-router-dom";
export function LoginPage() {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const { accessToken, setAccessToken, logout } = useAuth();
    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    const register = () => {
        navigate('/registration', { replace: true });
    };
    const loginUser = async () => {
        try {
            const res = await loginUserApi(login, password)
            setAccessToken(res.data.accessToken)
            console.log('✅ Успешный вход')
        } catch (err: any) {
            console.error('❌ Ошибка входа:', err.response?.data || err.message)
        }
    }

    // const getMe = async () => {
    //     try {
    //         const res = await getMeApi(accessToken)
    //         setMessage(JSON.stringify(res.data, null, 2))
    //         console.log('📥 Данные пользователя:', res.data)
    //     } catch (err) {
    //         setMessage('Ошибка доступа')
    //         console.error('❌ Ошибка доступа:', err)
    //     }
    // }

    return (
        <div className="container">
            <h1>Авторизация</h1>
            <div className="card">
                <input
                    placeholder="Логин"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={loginUser}>Войти</button>
                <button onClick={register}>Зарегистрироваться</button>
            </div>

            {/*<h2>Защищённый запрос</h2>*/}
            {/*<div className="card">*/}
            {/*    <button onClick={getMe}>Получить мои данные</button>*/}
            {/*    <pre>{message}</pre>*/}
            {/*</div>*/}

            {/*<h2>Выход</h2>*/}
            {/*<div className="card">*/}
            {/*    <button onClick={logout}>Выйти</button>*/}
            {/*</div>*/}
        </div>
    )
}

export default LoginPage
