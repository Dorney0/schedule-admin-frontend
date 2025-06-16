import { useState } from "react";
import "./AuthForms.css";

type RegisterPageProps = {
    onRegister: (data: { email: string; token?: string }) => void;
};

export default function RegisterPage({ onRegister }: RegisterPageProps) {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");       // новое поле
    const [login, setLogin] = useState("");             // новое поле, если нужен отдельный логин
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const baseUrl = 'http://localhost:5252/api';

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Пароли не совпадают");
            return;
        }

        setLoading(true);

        try {
            const body = {
                login: login || email,
                fullName,
                password
            };
            console.log("Отправляем данные регистрации:", body);

            const res = await fetch(`${baseUrl}/Auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });

            console.log("Статус ответа сервера:", res.status);

            if (!res.ok) {
                let errMsg = "Ошибка регистрации";
                try {
                    const errJson = await res.json();
                    if (errJson.errors) {
                        errMsg += ": " + Object.entries(errJson.errors)
                            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
                            .join("; ");
                    } else if (errJson.title) {
                        errMsg += ": " + errJson.title;
                    } else {
                        errMsg += ": " + JSON.stringify(errJson);
                    }
                } catch {
                    const errText = await res.text();
                    errMsg += ": " + errText;
                }
                alert(errMsg);
                return;
            }

            const data = await res.json();
            onRegister(data);

        } catch (error) {
            console.error("Ошибка сети или другая ошибка:", error);
            alert("Ошибка сети при регистрации: " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Регистрация</h2>
                {/* Поле для ФИО */}
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ФИО"
                    required
                    className="auth-input"
                    autoComplete="name"
                />
                {/* Опционально: если нужен отдельный логин */}
                {/*
                <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Логин"
                    required
                    className="auth-input"
                    autoComplete="username"
                />
                */}
                {/* Если не нужен отдельный логин, то можно убрать поле логина и использовать email как логин */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="auth-input"
                    autoComplete="email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                    required
                    className="auth-input"
                    autoComplete="new-password"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Подтвердите пароль"
                    required
                    className="auth-input"
                    autoComplete="new-password"
                />
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? "Регистрация..." : "Зарегистрироваться"}
                </button>
            </form>
        </div>
    );
}
