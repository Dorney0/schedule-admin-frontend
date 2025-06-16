import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("schedule", "routes/schedule.tsx"),
    route("settings", "routes/settings.tsx"),
    route("auth", "routes/authWithProvider.tsx"),
    route("registration", "routes/registration.tsx"),
] satisfies RouteConfig;