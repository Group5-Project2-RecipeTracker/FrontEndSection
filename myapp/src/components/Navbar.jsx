import "../styles/navbar.css";

export default function Navbar({ page, setPage }) {
    return (
        <div className="nav">
            <button
                className={`nav-btn ${page === "dashboard" ? "active" : ""}`}
                onClick={() => setPage("dashboard")}
            >
                Dashboard
            </button>

            <button
                className={`nav-btn ${page === "catalog" ? "active" : ""}`}
                onClick={() => setPage("catalog")}
            >
                Food Catalog
            </button>

            <button
                className={`admin-btn ${page === "admin" ? "active" : ""}`}
                onClick={() => setPage("admin")}
            >
                Admin
            </button>
        </div>
    );
}