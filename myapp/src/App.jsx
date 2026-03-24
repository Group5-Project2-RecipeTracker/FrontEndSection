import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import "./styles/global.css";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";
import FoodCatalog from "./pages/FoodCatalog.jsx";

export default function App() {
    return (
        <Routes>
            {/* Pages WITHOUT Navbar */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Pages WITH Navbar */}
            <Route element={<Layout />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/foodcatalog" element={<FoodCatalog />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route path="/" element={<Navigate to="/signup" replace />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}