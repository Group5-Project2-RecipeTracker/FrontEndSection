import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signUp, signInWithGoogle } from "../services/authService";

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
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();

            const res = await fetch("http://localhost:8080/api/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Backend auth failed");

            navigate("/dashboard");

        } catch (err) {
            console.error("Signup failed:", err);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #fde8e0 0%, #e8f0fe 50%, #ede0f7 100%)",
            fontFamily: "Lato, sans-serif",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Lato:wght@300;400;500&display=swap');
        input:focus { outline: none; border-bottom: 1.5px solid #1c1c1c !important; }
        ::placeholder { color: #d0ccc8; }
        .btn:hover { background: #333 !important; }
        .gbtn:hover { border-color: #bbb !important; }
      `}</style>

            <div style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(16px)",
                borderRadius: "20px",
                padding: "50px 44px",
                width: 360,
                boxShadow: "0 4px 30px rgba(0,0,0,0.07)",
                border: "1px solid rgba(255,255,255,0.9)",
            }}>
                <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 400, color: "#1c1c1c", marginBottom: 6 }}>Create account</h1>
                <p style={{ fontSize: 13, color: "#b0aba6", fontWeight: 300, marginBottom: 32 }}>Join Recipe Tracker today</p>

                {error && (
                    <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 16, background: "#fff5f5", padding: "8px 12px", borderRadius: 6 }}>
                        {error}
                    </p>
                )}

                <div style={{ display: "flex", gap: 16, marginBottom: 22 }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 10, letterSpacing: "0.1em", color: "#aaa", display: "block", marginBottom: 8 }}>FIRST NAME</label>
                        <input
                            type="text"
                            placeholder="Jane"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            style={{
                                width: "100%", background: "none", border: "none",
                                borderBottom: "1.5px solid #e8e4e0", padding: "8px 0",
                                fontSize: 14, color: "#1c1c1c",
                            }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 10, letterSpacing: "0.1em", color: "#aaa", display: "block", marginBottom: 8 }}>LAST NAME</label>
                        <input
                            type="text"
                            placeholder="Doe"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            style={{
                                width: "100%", background: "none", border: "none",
                                borderBottom: "1.5px solid #e8e4e0", padding: "8px 0",
                                fontSize: 14, color: "#1c1c1c",
                            }}
                        />
                    </div>
                </div>

                <label style={{ fontSize: 10, letterSpacing: "0.1em", color: "#aaa" }}>EMAIL</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                        display: "block", width: "100%", background: "none", border: "none",
                        borderBottom: "1.5px solid #e8e4e0", padding: "8px 0",
                        fontSize: 14, color: "#1c1c1c", marginBottom: 22, marginTop: 8,
                    }}
                />

                <label style={{ fontSize: 10, letterSpacing: "0.1em", color: "#aaa" }}>PASSWORD</label>
                <div style={{ position: "relative", marginTop: 8, marginBottom: 32 }}>
                    <input
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSignup()}
                        style={{
                            display: "block", width: "100%", background: "none", border: "none",
                            borderBottom: "1.5px solid #e8e4e0", padding: "8px 0",
                            fontSize: 14, color: "#1c1c1c",
                        }}
                    />
                    <button onClick={() => setShowPass(!showPass)} style={{
                        position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#ccc",
                    }}>{showPass ? "hide" : "show"}</button>
                </div>

                <button
                    className="btn"
                    onClick={handleSignup}
                    disabled={loading}
                    style={{
                        width: "100%", padding: 13, background: loading ? "#888" : "#1c1c1c", color: "#fff",
                        border: "none", borderRadius: 9, fontSize: 12, letterSpacing: "0.08em",
                        cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s", marginBottom: 18,
                    }}
                >
                    {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                    <div style={{ flex: 1, height: 1, background: "#ece8e4" }} />
                    <span style={{ fontSize: 11, color: "#ccc" }}>or</span>
                    <div style={{ flex: 1, height: 1, background: "#ece8e4" }} />
                </div>

                <button
                    className="gbtn"
                    onClick={handleGoogleSignup}
                    disabled={loading}
                    style={{
                        width: "100%", padding: 11, background: "transparent",
                        border: "1.5px solid #e8e4e0", borderRadius: 9, cursor: loading ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        fontSize: 13, color: "#555", transition: "border-color 0.2s", marginBottom: 28,
                    }}
                >
                    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                        <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Sign up with Google
                </button>

                <p style={{ textAlign: "center", fontSize: 12, color: "#c0bbb6" }}>
                    Already have an account? <a href="/login" style={{ color: "#999", textDecoration: "none" }}>Sign in</a>
                </p>
            </div>
        </div>
    );
}