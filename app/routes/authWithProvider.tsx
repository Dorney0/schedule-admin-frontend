import React from "react";
import { AuthProvider } from "~/modules/auth/AuthContext";
import Auth from "./auth";

export default function AuthWithProvider() {
    return (
        <AuthProvider>
            <Auth />
        </AuthProvider>
    );
}
