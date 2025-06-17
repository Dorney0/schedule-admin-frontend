import { createContext, useContext, useState } from "react";
import { logoutUser } from "~/api/auth";

export interface User {
    id: string;
    fullName: string;
    email?: string;
}

interface AuthContextType {
    accessToken: string;
    setAccessToken: (token: string) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState<User | null>(null);

    const logout = async () => {
        try {
            await logoutUser();
            setAccessToken("");
            setUser(null);
            console.log("🚪 Вы вышли из системы");
        } catch {
            console.error("❌ Ошибка выхода");
        }
    };

    return (
        <AuthContext.Provider
            value={{ accessToken, setAccessToken, user, setUser, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
