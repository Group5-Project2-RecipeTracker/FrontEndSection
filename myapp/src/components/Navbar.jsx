import { Link, useLocation, useNavigate } from "react-router-dom";
import { logOut } from "../services/authService";
import "../styles/Navbar.css";
import { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (user && user.email === "admin@email.com") {
            setIsAdmin(true);
        }
    }, []);
    async function handleLogout() {
        await logOut();
        navigate("/login");
    }

    return (
        <header className="navbar">
            <div className="navbar__brand">
                <Link to="/dashboard" className="navbar__brand-link">
                    Recipe Tracker
                </Link>
            </div>

            <nav className="navbar__nav">
                {isAdmin && location.pathname !== "/admin" && (
                    <Link to="/admin" className="navbar__link">
                        Admin
                    </Link>
                )}

                <button onClick={handleLogout} className="navbar__logout-button">
                    Log Out
                </button>
            </nav>
        </header>
    );
}