import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
    const [showPass, setShowPass] = useState(false);

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">Log In</h1>
                <p className="login-subtitle">Welcome back to Recipe Tracker</p>

                <label className="login-label">EMAIL</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    className="login-input"
                />

                <div className="login-row">
                    <label className="login-label">PASSWORD</label>
                    <a href="#" className="login-forgot">
                        Forgot?
                    </a>
                </div>

                <div className="password-wrap">
                    <input
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        className="login-input"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="show-pass-btn"
                    >
                        {showPass ? "hide" : "show"}
                    </button>
                </div>

                <button className="login-btn">LOG IN</button>

                <div className="divider">
                    <div className="divider-line" />
                    <span className="divider-text">or</span>
                    <div className="divider-line" />
                </div>

                <button className="google-btn">
                    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                        <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>

                <p className="login-footer">
                    No account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
}