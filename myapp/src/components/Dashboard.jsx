import "../styles/dashboard.css";

export default function Dashboard() {
    return (
        <div className="dashboard">
            <div className="sidebar left">
                <button className="button-dark">+ Add</button>
            </div>

            <div className="main">
                <div className="card">Main Content</div>
            </div>

            <div className="sidebar right">Recommendations</div>
        </div>
    );
}