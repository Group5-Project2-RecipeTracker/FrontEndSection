import "../styles/admin.css";

export default function Admin() {
    return (
        <div className="admin-container">
            <h2>Admin Dashboard</h2>

            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                <tr>
                    <td>John</td>
                    <td>john@email.com</td>
                    <td>
                        <button className="delete-btn">Delete</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}