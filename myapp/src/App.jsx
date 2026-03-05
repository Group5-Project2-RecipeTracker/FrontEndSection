import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Login from "./pages/Login.jsx";

import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectLayout from "./pages/projects/ProjectLayout.jsx";
import ProjectOverview from "./pages/projects/ProjectOverview.jsx";
import ProjectTasks from "./pages/projects/ProjectTasks.jsx";
import ProjectFiles from "./pages/projects/ProjectFiles.jsx";
import ProjectTeam from "./pages/projects/ProjectTeam.jsx";
import ProjectSettings from "./pages/projects/ProjectSettings.jsx";

export default function App() {
  return (
    <Routes>

      {/* Pages WITH Navbar */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<dashboard />} />
        <Route path="/projects" element={<Projects />} />

        <Route path="/projects/:projectId" element={<ProjectLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ProjectOverview />} />
          <Route path="tasks" element={<ProjectTasks />} />
          <Route path="files" element={<ProjectFiles />} />
          <Route path="team" element={<ProjectTeam />} />
          <Route path="settings" element={<ProjectSettings />} />
        </Route>
      </Route>

      {/* Pages WITHOUT Navbar */}
      <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />

      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}