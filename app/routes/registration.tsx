import type { Route } from "./+types/home";
import Sidebar from '../components/sidebar/Sidebar';
import RegisterPage from "~/modules/auth/RegisterPage";
import {Navigate} from "react-router-dom";
import {useAuth} from "~/modules/auth/AuthContext";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Auth" },
        { name: "description", content: "Welcome to Auth!" },
    ];
}

export default function AuthRoute() {
    const { accessToken } = useAuth();

    if (accessToken) {
        return <Navigate to="/" replace />;
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main className="flex items-center justify-center min-h-screen p-4 flex-1 w-full">
                <RegisterPage />
            </main>
        </div>
    );
}
