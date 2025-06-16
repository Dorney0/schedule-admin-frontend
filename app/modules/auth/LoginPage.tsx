import { useState } from "react";
import "./AuthForms.css";
import type { LoginResponse, User } from "~/modules/auth/AuthContext";

type LoginPageProps = {
    onLogin: (user: User, token: string) => void;
    onRegisterClick: () => void;
};

export default function LoginPage({ onLogin, onRegisterClick }: LoginPageProps) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const baseUrl = 'http://localhost:5252/api';

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch(`${baseUrl}/Auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, password }),
            credentials: "include",
        });

        if (res.ok) {
            const data: LoginResponse = await res.json();
            localStorage.setItem("token", data.token);

            const meRes = await fetch(`${baseUrl}/Auth/me`, {
                headers: {
                    "Authorization": `Bearer ${data.token}`
                }
            });

            if (meRes.ok) {
                const user: User = await meRes.json();
                alert(`Пользователь вошёл: ${user.fullName}`);
                onLogin(user, data.token); // <-- вот так правильно
            } else {
                alert("Не удалось получить данные пользователя.");
                onLogin(null, ""); // передаём пустую строку как токен
            }
        } else {
            alert("Ошибка входа");
        }
    }

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Вход</h2>
                <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Логин"
                    required
                    className="auth-input"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                    required
                    className="auth-input"
                />
                <button type="submit" className="auth-button">
                    Войти
                </button>
            </form>

            <div className="register-block">
                <p>Нет аккаунта?</p>
                <button
                    onClick={() => {
                        console.log("Нажата кнопка регистрации");
                        onRegisterClick();
                    }}
                    className="register-button"
                >
                    Зарегистрироваться
                </button>
            </div>
        </div>
    );
}
