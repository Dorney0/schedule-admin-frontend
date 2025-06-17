import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {AuthProvider, useAuth} from "./modules/auth/AuthContext";
const { accessToken } = useAuth();
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
