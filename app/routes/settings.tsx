import type { Route } from "./+types/home";
import Sidebar from '../components/sidebar/Sidebar';
import SettingsPage from '../modules/settings/SettingsPage';
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Settings" },
        { name: "description", content: "Welcome to Settings!" },
    ];
}

export default function Settings() {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main className="flex items-center justify-center min-h-screen p-4 flex-1">
                <SettingsPage />
            </main>
        </div>
    );
}
