import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function PrivateRoute() {
    const { accessToken } = useAuth();

    // Если нет токена — редирект на /auth
    if (!accessToken) {
        return <Navigate to="/auth" replace />;
    }

    // Иначе показываем дочерние маршруты (через Outlet)
    return <Outlet />;
}
