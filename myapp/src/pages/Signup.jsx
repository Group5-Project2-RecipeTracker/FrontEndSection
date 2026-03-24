import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/signup.css";

export default function Signup() {
    const [showPass, setShowPass] = useState(false);

    return (
        <div className="signup-page">
            <div className="signup-card">
                <h1 className="signup-title">Create account</h1>
                <p className="signup-subtitle">Join Recipe Tracker today</p>

                <div className="signup-name-row">
                    <div className="signup-field">
                        <label className="signup-label">FIRST NAME</label>
                        <input type="text" placeholder="Jane" className="signup-input" />
                    </div>

                    <div className="signup-field">
                        <label className="signup-label">LAST NAME</label>
                        <input type="text" placeholder="Doe" className="signup-input" />
                    </div>
                </div>

                <label className="signup-label">EMAIL</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    className="signup-input signup-input-spaced"
                />

                <label className="signup-label">PASSWORD</label>
                <div className="signup-password-wrap">
                    <input
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        className="signup-input signup-password-input"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="signup-show-btn"
                    >
                        {showPass ? "hide" : "show"}
                    </button>
                </div>

                <button className="signup-btn">CREATE ACCOUNT</button>

                <div className="signup-divider">
                    <div className="signup-divider-line" />
                    <span className="signup-divider-text">or</span>
                    <div className="signup-divider-line" />
                </div>

                <button className="signup-google-btn">
                    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" fill="#4285F4" />
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                        <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335" />
                    </svg>
                    Sign up with Google
                </button>

                <p className="signup-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}