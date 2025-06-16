import type { User } from "./AuthContext";

export async function fetchUserByToken(token: string): Promise<User | null> {
    try {
        const res = await fetch("http://localhost:5252/api/Auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}
