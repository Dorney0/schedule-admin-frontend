import type { Route } from "./+types/home";
import Sidebar from '../components/sidebar/Sidebar';
import SchedulePage from '../modules/schedule/SсhedulePage.jsx';
export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Home() {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{ padding: '1rem', flex: 1 }}>
                <SchedulePage />
            </main>
        </div>
    );
}
