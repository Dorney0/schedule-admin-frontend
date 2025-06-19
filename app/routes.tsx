import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("schedule", "routes/schedule.tsx"),
    route("settings", "routes/settings.tsx"),
    route("auth", "routes/auth.tsx"),
    route("registration", "routes/registration.tsx"),
    route("print", "routes/print.tsx"),
    route("preferences", "routes/preferences.tsx"),
    route("request", "routes/request.tsx")
] satisfies RouteConfig;