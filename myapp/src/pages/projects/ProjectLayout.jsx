import { NavLink, Outlet, useParams, Link } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  marginRight: 12,
  textDecoration: "none",
  fontWeight: isActive ? "700" : "400",
});

export default function ProjectLayout() {
  const { projectId } = useParams();

  return (
    <div style={{ padding: 20 }}>
      <h2>Project: {projectId}</h2>

      <div style={{ marginBottom: 12 }}>
        <NavLink to="overview" style={linkStyle}>
          Overview
        </NavLink>
        <NavLink to="tasks" style={linkStyle}>
          Tasks
        </NavLink>
        <NavLink to="files" style={linkStyle}>
          Files
        </NavLink>
        <NavLink to="team" style={linkStyle}>
          Team
        </NavLink>
        <NavLink to="settings" style={linkStyle}>
          Settings
        </NavLink>
      </div>

      <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <Outlet />
      </div>

      <p style={{ marginTop: 16 }}>
        <Link to="/projects">← All Projects</Link>
      </p>
    </div>
  );
}