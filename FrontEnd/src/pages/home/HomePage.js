import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import { AppBar, Box, Button, Card, CardActionArea, CardContent, Container, Stack, Toolbar, Typography, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useReservationStore } from "../../store/reservationFlowStore";
import styles from "./HomePage.module.css";
export default function HomePage() {
    const navigate = useNavigate();
    const setReservationMode = useReservationStore((s) => s.setReservationMode);
    const continueAsGuest = () => {
        setReservationMode("guest");
        sessionStorage.setItem("reservationMode", "guest");
        navigate("/reservation");
    };
    const continueAsRegistered = () => {
        setReservationMode("registered");
        sessionStorage.setItem("reservationMode", "registered");
        navigate("/login");
    };
    return (_jsxs(Box, { className: styles.page, children: [_jsx(AppBar, { position: "static", elevation: 0, className: styles.appBar, children: _jsxs(Toolbar, { className: styles.toolbar, children: [_jsx(Box, { className: styles.brandWrap, children: _jsx(Typography, { noWrap: true, variant: "h4", className: styles.brandTitle, children: "Reserve & Dine" }) }), _jsx(Button, { variant: "contained", size: "small", onClick: () => navigate("/admin"), sx: {
                                minWidth: "auto",
                                px: 2,
                                borderRadius: 3,
                                textTransform: "none",
                                fontWeight: 700,
                                backgroundColor: "#7c3aed",
                                "&:hover": { backgroundColor: "#6d28d9" },
                            }, children: "Admin" }), _jsx(Button, { variant: "contained", onClick: continueAsRegistered, className: styles.loginButton, children: "Login / Register" })] }) }), _jsx(Container, { maxWidth: "lg", className: styles.container, children: _jsxs(Stack, { spacing: 6, children: [_jsxs(Box, { className: styles.hero, children: [_jsx(Typography, { variant: "h1", className: styles.heroTitle, children: "Welcome to Reserve & Dine" }), _jsx(Typography, { variant: "h5", className: styles.heroSubtitle, children: "Your table is waiting" })] }), _jsxs(Stack, { direction: { xs: "column", md: "row" }, spacing: 4, className: styles.choiceStack, children: [_jsx(Card, { className: styles.choiceCard, children: _jsx(CardActionArea, { onClick: continueAsGuest, children: _jsx(CardContent, { className: styles.choiceCardContent, children: _jsxs(Stack, { spacing: 3, className: styles.choiceCardInner, children: [_jsx(Box, { className: `${styles.iconCircle} ${styles.guestCircle}`, children: _jsx(Groups2OutlinedIcon, { className: `${styles.icon} ${styles.guestIcon}` }) }), _jsx(Typography, { variant: "h4", className: styles.choiceTitle, children: "Continue as Guest" }), _jsx(Typography, { variant: "h6", className: styles.choiceDescription, children: "Make a quick reservation without signing in" })] }) }) }) }), _jsx(Card, { className: styles.choiceCard, children: _jsx(CardActionArea, { onClick: continueAsRegistered, children: _jsx(CardContent, { className: styles.choiceCardContent, children: _jsxs(Stack, { spacing: 3, className: styles.choiceCardInner, children: [_jsx(Box, { className: `${styles.iconCircle} ${styles.registeredCircle}`, children: _jsx(HowToRegOutlinedIcon, { className: `${styles.icon} ${styles.registeredIcon}` }) }), _jsx(Typography, { variant: "h4", className: styles.choiceTitle, children: "Registered User" }), _jsx(Typography, { variant: "h6", className: styles.choiceDescription, children: "Sign in to access your account and earn points" })] }) }) }) })] }), _jsx(Box, { className: styles.infoSection, children: _jsx(Box, { className: styles.overlay, children: _jsx(Typography, { className: styles.infoText, children: "Reservations are highly recommended. Please let us know if there is anything we can do to enhance your dining experience. If your preferred date or time is unavailable, please call us and we will do our best to accommodate your desired date and time." }) }) })] }) })] }));
}
