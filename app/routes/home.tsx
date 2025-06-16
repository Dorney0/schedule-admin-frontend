import type { Route } from "./+types/home";
import Sidebar from '../components/sidebar/Sidebar';
import HomePage from "~/modules/home/HomePage.jsx";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to Home!" },
  ];
}

export default function Home() {
  return (
      <div style={{ display: 'flex' }}>
          <Sidebar />
          <main className="flex items-center justify-center min-h-screen p-4 flex-1 w-full">
              <HomePage />
          </main>
      </div>
  );
}
