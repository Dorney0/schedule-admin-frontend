import type { Route } from "./+types/home";
import Sidebar from '../components/sidebar/Sidebar';
import SettingsPage from '../modules/settings/SettingsPage';
import {useAuth} from "~/modules/auth/AuthContext";
import {Navigate} from "react-router-dom";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Settings" },
        { name: "description", content: "Welcome to Settings!" },
    ];
}

export default function Settings() {
    const { accessToken } = useAuth();

    if (!accessToken) {
        return <Navigate to="/auth" replace />;
    }
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main className="flex items-center justify-center min-h-screen p-4 flex-1">
                <SettingsPage />
            </main>
        </div>
    );
}
