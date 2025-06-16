import type { Route } from "./+types/home";
import Sidebar from '../components/sidebar/Sidebar';
import LoginPage from "~/modules/auth/LoginPage";
import { useAuth } from "~/modules/auth/AuthContext";
import type { User } from "~/modules/auth/AuthContext";
import { useNavigate } from "react-router-dom";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Auth" },
        { name: "description", content: "Welcome to Auth!" },
    ];
}

export default function Auth() {
    const { login } = useAuth();
    const navigate = useNavigate();
    type LoginData = {
        token: string;
        user: User;
    };

    function handleLogin(user: User, token: string) {
        console.log('Пользователь вошёл:', user.fullName);
        login(user, token);
        document.cookie = `token=${token}; path=/; max-age=3600`;
        navigate("/");
    }


    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main className="flex items-center justify-center min-h-screen p-4 flex-1 w-full">
                <LoginPage onLogin={handleLogin}  onRegisterClick={() => navigate("/registration")}/>
            </main>
        </div>
    );
}