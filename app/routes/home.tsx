import type { Route } from "./+types/home";
import Sidebar from "../components/sidebar/Sidebar";
import HomePage from "~/modules/home/HomePage.jsx";
//import UserProfile from "~/components/UserProfile/UserProfile";
//import { useAuth } from "~/modules/auth/AuthContext";
import {Navigate, useNavigate} from "react-router-dom";
import { useEffect } from "react";
import {useAuth} from "~/modules/auth/AuthContext";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Home" },
        { name: "description", content: "Welcome to Home!" },
    ];
}

export default function Home() {
    const { accessToken } = useAuth();

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
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid #ddd'
                }}
            >
                {/* <UserProfile user={user} /> */}
            </header>

            <div style={{ display: 'flex', flex: 1 }}>
                <Sidebar />
                <main className="flex items-center justify-center p-4 flex-1 w-full">
                    <HomePage />
                </main>
            </div>
        </div>
    );
}

