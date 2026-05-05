import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import styles from "./RegisterPage.module.css";
export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    registerForm,
    setRegisterField,
    loading,
    error,
    setLoading,
    setError,
    resetRegisterForm,
  } = useAuthStore();
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  useEffect(() => {
    resetRegisterForm();
  }, []);
  const handleRegister = async () => {
    try {
      setError(null);
      setEmailError("");
      setPhoneError("");
      setPasswordError("");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerForm.email)) {
        setEmailError("Please enter a valid email address");
        return;
      }
      if (registerForm.phone.trim().length < 10) {
        setPhoneError("Please enter a valid phone number");
        return;
      }
      if (registerForm.password.length < 12) {
        setPasswordError("Password must be at least 12 characters long");
        return;
      }
      if (registerForm.password !== registerForm.confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
      setLoading(true);
      await axios.post("http://localhost:5001/api/auth/register", {
        userName: registerForm.name,
        userEmail: registerForm.email,
        userPhone: registerForm.phone,
        userPassword: registerForm.password,
        userMailingAddress: registerForm.mailingAddress,
        userBillingAddress: registerForm.billingSameAsMailing
          ? registerForm.mailingAddress
          : registerForm.billingAddress,
        isBillingAddressSame: registerForm.billingSameAsMailing,
        preferredPayment: registerForm.preferredPayment,
      });
      const loginRes = await axios.post("http://localhost:5001/api/auth/login", {
        userEmail: registerForm.email,
        userPassword: registerForm.password,
      });
      localStorage.setItem("token", loginRes.data.data.token);
      resetRegisterForm();
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };
  return _jsx(Box, {
    className: styles.page,
    children: _jsx(Container, {
      maxWidth: "sm",
      className: styles.container,
      children: _jsxs(Stack, {
        spacing: 3,
        children: [
          _jsx(Button, {
            startIcon: _jsx(ArrowBackRoundedIcon, {}),
            onClick: () => navigate("/"),
            className: styles.backButton,
            children: "Home",
          }),
          _jsx(Card, {
            className: styles.card,
            children: _jsx(CardContent, {
              className: styles.cardContent,
              children: _jsxs(Stack, {
                spacing: 4,
                className: styles.content,
                children: [
                  _jsx(Box, {
                    className: styles.iconCircle,
                    children: _jsx(PersonAddAltRoundedIcon, { className: styles.icon }),
                  }),
                  _jsxs(Box, {
                    className: styles.header,
                    children: [
                      _jsx(Typography, {
                        variant: "h2",
                        className: styles.title,
                        children: "Create Account",
                      }),
                      _jsx(Typography, {
                        variant: "h6",
                        className: styles.subtitle,
                        children: "Join Reserve & Dine and manage your reservations with ease",
                      }),
                    ],
                  }),
                  _jsxs(Stack, {
                    spacing: 3,
                    className: styles.formStack,
                    children: [
                      _jsx(TextField, {
                        fullWidth: true,
                        label: "Full Name",
                        placeholder: "Enter your full name",
                        value: registerForm.name,
                        onChange: (e) => setRegisterField("name", e.target.value),
                      }),
                      _jsx(TextField, {
                        fullWidth: true,
                        label: "Email Address",
                        type: "email",
                        placeholder: "Enter your email",
                        value: registerForm.email,
                        error: !!emailError,
                        helperText: emailError,
                        onChange: (e) => {
                          setEmailError("");
                          setRegisterField("email", e.target.value);
                        },
                      }),
                      _jsx(TextField, {
                        fullWidth: true,
                        label: "Phone Number",
                        placeholder: "Enter your phone number",
                        value: registerForm.phone,
                        error: !!phoneError,
                        helperText: phoneError,
                        onChange: (e) => {
                          setPhoneError("");
                          setRegisterField("phone", e.target.value);
                        },
                      }),
                      _jsx(TextField, {
                        fullWidth: true,
                        label: "Mailing Address",
                        placeholder: "Enter your mailing address",
                        value: registerForm.mailingAddress,
                        onChange: (e) => setRegisterField("mailingAddress", e.target.value),
                      }),
                      _jsx(FormControlLabel, {
                        control: _jsx(Checkbox, {
                          checked: registerForm.billingSameAsMailing,
                          onChange: (e) =>
                            setRegisterField("billingSameAsMailing", e.target.checked),
                        }),
                        label: "Billing address same as mailing address",
                      }),
                      !registerForm.billingSameAsMailing &&
                        _jsx(TextField, {
                          fullWidth: true,
                          label: "Billing Address",
                          placeholder: "Enter your billing address",
                          value: registerForm.billingAddress,
                          onChange: (e) => setRegisterField("billingAddress", e.target.value),
                        }),
                      _jsxs(TextField, {
                        fullWidth: true,
                        select: true,
                        label: "Preferred Payment",
                        value: registerForm.preferredPayment,
                        onChange: (e) => setRegisterField("preferredPayment", e.target.value),
                        children: [
                          _jsx(MenuItem, { value: "CASH", children: "Cash" }),
                          _jsx(MenuItem, { value: "CREDIT", children: "Credit" }),
                          _jsx(MenuItem, { value: "CHECK", children: "Check" }),
                        ],
                      }),
                      _jsx(TextField, {
                        fullWidth: true,
                        label: "Password",
                        type: "password",
                        placeholder: "Create a password",
                        value: registerForm.password,
                        autoComplete: "new-password",
                        error: !!passwordError,
                        helperText: passwordError,
                        onChange: (e) => {
                          setPasswordError("");
                          setRegisterField("password", e.target.value);
                        },
                      }),
                      _jsx(TextField, {
                        fullWidth: true,
                        label: "Confirm Password",
                        type: "password",
                        placeholder: "Confirm your password",
                        value: registerForm.confirmPassword,
                        autoComplete: "new-password",
                        error: !!passwordError,
                        onChange: (e) => {
                          setPasswordError("");
                          setRegisterField("confirmPassword", e.target.value);
                        },
                      }),
                    ],
                  }),
                  error && _jsx(Typography, { color: "error", variant: "body2", children: error }),
                  _jsx(Button, {
                    variant: "contained",
                    size: "large",
                    className: styles.registerButton,
                    onClick: handleRegister,
                    disabled: loading,
                    children: loading ? "Creating Account..." : "Create Account",
                  }),
                  _jsxs(Box, {
                    className: styles.footer,
                    children: [
                      _jsx(Typography, {
                        variant: "body1",
                        className: styles.footerText,
                        children: "Already have an account?",
                      }),
                      _jsx(Button, {
                        onClick: () => navigate("/login"),
                        className: styles.signInButton,
                        children: "Sign in",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          }),
        ],
      }),
    }),
  });
}
