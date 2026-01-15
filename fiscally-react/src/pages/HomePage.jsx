import React from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../util/auth";
import Home from "./Home"; // your existing dashboard Home
import Landing from "../components/Landing"; // public UI

const HomePage = () => {
    const navigate = useNavigate();
    const loggedIn = isAuthenticated();

    // 🔓 Non-authenticated user
    if (!loggedIn) {
        return (
        <Landing
            onLogin={() => navigate("/login")}
            onRegister={() => navigate("/register")}
        />
        );
    }

    // 🔐 Authenticated user
    return <Home />;
};

export default HomePage;
