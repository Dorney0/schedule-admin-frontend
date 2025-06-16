import { useNavigate } from "react-router-dom";
import { useAuth } from "~/modules/auth/AuthContext.js";
import RegisterPage from "~/modules/auth/RegisterPage"; // если нужна авторизация

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth(); // если надо

    async function handleRegister(data: any) {
        console.log("Регистрация пользователя:", data);

        // например, вызываем API регистрации
        // const res = await fetch(...);

        // если успешно — залогинить пользователя и перейти куда нужно
        login(data);
        navigate("/"); // или на нужный вам маршрут после успешной регистрации

    }

    return (
        <div style={{ display: 'flex' }}>
            <main className="flex items-center justify-center min-h-screen p-4 flex-1 w-full">
                <RegisterPage onRegister={handleRegister} />
            </main>
        </div>
    );
}
