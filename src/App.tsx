import { useState } from "react";
import "./App.css";
import { TodoWrapper } from "./components/TodoWrapper";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
        !!localStorage.getItem("accessToken")
    );

    const [showSignup, setShowSignup] = useState<boolean>(false);
    const [showProfile, setShowProfile] = useState<boolean>(false);

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        setShowSignup(false);
        setShowProfile(false);
    };

    if (!isLoggedIn) {
        if (showSignup) {
            return (
                <Signup
                    onSignupSuccess={() => setShowSignup(false)}
                    onLogin={() => setShowSignup(false)}
                />
            );
        }

        return (
            <Login
                onLogin={handleLogin}
                onSignup={() => setShowSignup(true)}
            />
        );
    }

    return (
        <div className="dashboard">

            {/* Header */}
            <header className="dashboard-header">

                <div className="dashboard-title">
                    <h1>Get Things Done</h1>
                    <p>Manage your tasks and stay organized.</p>
                </div>

                <div className="header-actions">

                    {/* Profile */}
                    <div className="profile-wrapper">

                        <button
                            className="profile-btn"
                            onClick={() =>
                                setShowProfile(!showProfile)
                            }
                        >
                            View Profile
                        </button>

                        {showProfile && (
                            <div className="profile-popup">

                                <h3>Profile</h3>

                                <div className="profile-detail">
                                    <span>Name</span>
                                    <strong>
                                        {user.name || "User"}
                                    </strong>
                                </div>

                                <div className="profile-detail">
                                    <span>Email</span>
                                    <strong>
                                        {user.email || "Not available"}
                                    </strong>
                                </div>

                            </div>
                        )}

                    </div>

                    {/* Logout */}
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>

            {/* Dashboard */}
            <main className="dashboard-content">
                <TodoWrapper />
            </main>

        </div>
    );
}

export default App;