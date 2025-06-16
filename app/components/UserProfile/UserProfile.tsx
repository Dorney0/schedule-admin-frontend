import React, { useState, useRef, useEffect } from "react";
import "./UserProfile.css";
import type { User } from "~/modules/auth/AuthContext";

type UserProfileProps = {
    user: User | null;
};

export default function UserProfile({ user }: UserProfileProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    if (!user) return null;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="user-profile" ref={containerRef}>
            <div
                className="user-info"
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                        setIsOpen(!isOpen);
                    }
                }}
            >
                <div className="user-initial">{user.fullName[0].toUpperCase()}</div>
                <span>{user.fullName}</span>
            </div>

            <div className={`logout-bar ${isOpen ? "open" : ""}`} onClick={() => {
                setIsOpen(false);
            }}>
                Выйти
            </div>
        </div>
    );
}
