import type { Route } from "./+types/home";
import Sidebar from '../components/sidebar/Sidebar';
import SettingsPage from '../modules/settings/SettingsPage';
import {useAuth} from "~/modules/auth/AuthContext";
import {Navigate} from "react-router-dom";
import UserProfile from "~/components/UserProfile/UserProfile";
import {useEffect, useState} from "react";
import {getMe} from "~/api/auth";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Settings" },
        { name: "description", content: "Welcome to Settings!" },
    ];
}

export default function Settings() {
    const { accessToken } = useAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!accessToken) return;

        async function fetchUser() {
            try {
                const res = await getMe(accessToken);
                setUser(res.data); // res.data должен содержать объект с полем fullName
            } catch (error) {
                console.error("Ошибка загрузки данных пользователя", error);
            }
        }

        fetchUser();
    }, [accessToken]);

    if (!accessToken) {
        return <Navigate to="/auth" replace />;
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <header
                style={{
                    position: 'relative',
                    height: '56px',
                    padding: '0 16px',
                    paddingBottom: '16px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid #ddd'
                }}
            >
                <UserProfile user={user} />
            </header>

            <div style={{ display: 'flex', flex: 1 }}>
                    <Sidebar />
                        <main className="flex items-center justify-center p-4 flex-1 w-full">
                    <SettingsPage />
                </main>
            </div>
        </div>
    );
}
