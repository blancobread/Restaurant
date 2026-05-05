import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import styles from "./LoginPage.module.css";
export default function LoginPage() {
    const navigate = useNavigate();
    const { loginForm, loading, error, setLoginField, setLoading, setError, loginSuccess, resetLoginForm, } = useAuthStore();
    const handleLogin = async () => {
        setError(null);
        if (!loginForm.email || !loginForm.password) {
            setError("Please fill in all fields");
            return;
        }
        if (!loginForm.email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }
        if (loginForm.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5001/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userEmail: loginForm.email,
                    userPassword: loginForm.password,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
            const token = data.data.token;
            const user = data.data.user;
            loginSuccess(token, user);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            resetLoginForm();
            navigate("/profile");
        }
        catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
            else {
                setError("Something went wrong");
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Box, { className: styles.page, children: _jsx(Container, { maxWidth: "sm", className: styles.container, children: _jsxs(Stack, { spacing: 3, children: [_jsx(Button, { startIcon: _jsx(ArrowBackRoundedIcon, {}), onClick: () => navigate("/"), className: styles.backButton, children: "Home" }), _jsx(Card, { className: styles.card, children: _jsx(CardContent, { className: styles.cardContent, children: _jsxs(Stack, { spacing: 4, className: styles.content, children: [_jsx(Box, { className: styles.iconCircle, children: _jsx(LoginRoundedIcon, { className: styles.icon }) }), _jsxs(Box, { className: styles.header, children: [_jsx(Typography, { variant: "h2", className: styles.title, children: "Sign In" }), _jsx(Typography, { variant: "h6", className: styles.subtitle, children: "Welcome back to Reserve & Dine" })] }), _jsxs(Stack, { spacing: 3, sx: { width: "100%" }, children: [_jsx(TextField, { fullWidth: true, label: "Email Address", placeholder: "Enter your email", value: loginForm.email, onChange: (e) => setLoginField("email", e.target.value) }), _jsx(TextField, { fullWidth: true, label: "Password", type: "password", placeholder: "Enter your password", value: loginForm.password, onChange: (e) => setLoginField("password", e.target.value) })] }), _jsx(Button, { variant: "contained", size: "large", className: styles.signInButton, onClick: handleLogin, disabled: loading, children: loading ? "Signing In..." : "Sign In" }), error && (_jsx(Typography, { variant: "body2", color: "error", children: error })), _jsxs(Box, { className: styles.footer, children: [_jsx(Typography, { variant: "body1", className: styles.footerText, children: "Don't have an account?" }), _jsx(Button, { onClick: () => navigate("/register"), className: styles.registerButton, children: "Create one" })] })] }) }) })] }) }) }));
}
