import type { Route } from "./+types/home";
import Sidebar from "../components/sidebar/Sidebar";
import HomePage from "~/modules/home/HomePage.jsx";
import UserProfile from "~/components/UserProfile/UserProfile";
import { useAuth } from "~/modules/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Home" },
        { name: "description", content: "Welcome to Home!" },
    ];
}

export default function Home() {
    const { user } = useAuth();

    if (user === null) return <div>Загрузка...</div>;


    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div className="flex justify-end p-4">
                <UserProfile user={user} />
            </div>
            <div style={{ display: 'flex', flex: 1 }}>
                <Sidebar />
                <main className="flex items-center justify-center p-4 flex-1 w-full">
                    <HomePage />
                </main>
            </div>
        </div>
    );
}

