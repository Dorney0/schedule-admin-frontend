import { createContext, useContext, useState } from "react";
import {logoutUser} from "~/api/auth";

interface AuthContextType {
    accessToken: string;
    setAccessToken: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState("");
    const logout = async () => {
        try {
            await logoutUser()
            setAccessToken('')
            console.log('🚪 Вы вышли из системы')
        } catch {
            console.error('❌ Ошибка выхода')
        }
    }
    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
