import { Link } from "react-router-dom";

export default function Projects() {
  // Filler data for now
  const projects = [
    { id: "alpha", name: "Project Alpha" },
    { id: "beta", name: "Project Beta" },
    { id: "gamma", name: "Project Gamma" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Projects</h2>

      <p>Select a project:</p>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <Link to={`/projects/${p.id}/overview`}>{p.name}</Link>
          </li>
        ))}
      </ul>

      <p style={{ marginTop: 16 }}>
        <Link to="/dashboard">← Back to Dashboard</Link>
      </p>
    </div>
  );
}