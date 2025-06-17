import type { Route } from "./+types/home";
import Sidebar from '../components/sidebar/Sidebar';
import PrintPage from '../modules/print/PrintPage';
import {useAuth} from "~/modules/auth/AuthContext";
import {Navigate} from "react-router-dom";
//import UserProfile from "~/components/UserProfile/UserProfile";
//import { useAuth } from "~/modules/auth/AuthContext.js";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Print" },
        { name: "description", content: "Welcome to Schedule!" },
    ];
}

export default function Print() {
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
                    <main
                        className="flex items-center justify-center p-4 flex-1 w-full"
                        style={{ paddingBottom: '500px' }}>
                        <PrintPage />
                    </main>

            </div>
        </div>
    );
}
