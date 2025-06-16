import React, { createContext, useContext, useState, useEffect } from 'react';

export type LoginResponse = {
    token: string;
};

export type User = {
    id: number;
    fullName: string;
    login: string;
    email: string | null;
    phone: string | null;
    role: string;
};

type AuthContextType = {
    user: User | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
};


const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            return;
        }

        // 👇 не вызывай localStorage.removeItem слишком рано
        fetch("http://localhost:5252/api/Auth/me", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                if (data) setUser(data);
                else {
                    setUser(null);
                    localStorage.removeItem('token'); // только если точно невалидный
                }
            })
            .catch(() => {
                setUser(null);
                localStorage.removeItem('token');
            });
    }, []);


    const login = (userData: User, token: string) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};