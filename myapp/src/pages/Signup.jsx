import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signInWithGoogle } from "../services/authService";
import "../styles/Signup.css";

export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await signUp(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message.replace("Firebase: ", ""));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            const result = await signInWithGoogle();
            const token = await result.user.getIdToken();
            localStorage.setItem("token", token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message.replace("Firebase: ", ""));
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <h1 className="signup-title">Create account</h1>

                {error && <p className="signup-error">{error}</p>}

                <div className="signup-name-row">
                    <div className="signup-name-group">
                        <label className="signup-label signup-label-block">FIRST NAME</label>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="signup-input signup-input-no-margin"
                        />
                    </div>

                    <div className="signup-name-group">
                        <label className="signup-label signup-label-block">LAST NAME</label>
                        <input
                            type="text"
                            placeholder="last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="signup-input signup-input-no-margin"
                        />
                    </div>
                </div>

                <label className="signup-label">EMAIL</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="signup-input signup-input-email"
                />

                <label className="signup-label">PASSWORD</label>
                <div className="signup-password-wrap">
                    <input
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                        className="signup-input signup-input-no-margin"
                    />
                    <button
                        onClick={() => setShowPass(!showPass)}
                        className="signup-show-toggle"
                        type="button"
                    >
                        {showPass ? "hide" : "show"}
                    </button>
                </div>

                <button
                    className="signup-button"
                    onClick={handleSignup}
                    disabled={loading}
                >
                    {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                </button>

                <div className="signup-divider">
                    <div className="signup-divider-line" />
                    <span className="signup-divider-text">or</span>
                    <div className="signup-divider-line" />
                </div>

                <button
                    className="gbtn"
                    onClick={handleGoogleSignup}
                    disabled={loading}
                >
                    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                        <path
                            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z"
                            fill="#4285F4"
                        />
                        <path
                            d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                            fill="#34A853"
                        />
                        <path
                            d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"
                            fill="#EA4335"
                        />
                    </svg>
                    Sign up with Google
                </button>

                <p className="signup-footer-text">
                    Already have an account?{" "}
                    <a href="/login" className="signup-signin-link">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}