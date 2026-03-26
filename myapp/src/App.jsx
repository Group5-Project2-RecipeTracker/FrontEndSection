import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />

            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/login" replace />} />

                <Route path="dashboard" element={<Dashboard />} />
                <Route path="admin" element={<Admin />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

