import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authorizeHoldingFee, getReservationById } from "../reservationApi";
const CARD_TYPES = ["VISA", "MASTERCARD", "AMEX"];
export default function ReservationPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("");
  const [expiry, setExpiry] = useState("");
  useEffect(() => {
    async function loadReservation() {
      if (!id) {
        setErrorMessage("Missing reservation ID.");
        setIsLoading(false);
        return;
      }
      try {
        const response = await getReservationById(id);
        setReservation(response.data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load reservation payment details.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadReservation();
  }, [id]);
  const validateExpiry = (value) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(value)) return false;
    const [monthStr, yearStr] = value.split("/");
    const month = Number(monthStr);
    const year = 2000 + Number(yearStr);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    // Expired if year is less OR same year but month already passed
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
  };
  const handleAuthorizeHoldingFee = async () => {
    if (!reservation) return;
    setPaymentError("");
    const cleanedCardNumber = cardNumber.replace(/\D/g, "");
    if (!cleanedCardNumber || !cardType || !expiry) {
      setPaymentError("All fields are required");
      return;
    }
    if (cleanedCardNumber.length < 12 || cleanedCardNumber.length > 19) {
      setPaymentError("Card number must be between 12 and 19 digits");
      return;
    }
    if (!CARD_TYPES.includes(cardType)) {
      setPaymentError("Please select a valid card type");
      return;
    }
    if (!validateExpiry(expiry)) {
      setPaymentError("Enter a valid, non-expired expiry date (MM/YY)");
      return;
    }
    setIsAuthorizing(true);
    try {
      await authorizeHoldingFee(reservation.id, {
        cardNumber: cleanedCardNumber,
        cardType,
      });
      navigate(`/reservation/confirmation/${reservation.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to authorize holding fee.";
      setPaymentError(message);
    } finally {
      setIsAuthorizing(false);
    }
  };
  if (isLoading) {
    return _jsx(Container, {
      sx: { py: 6 },
      children: _jsx(Typography, { children: "Loading payment details..." }),
    });
  }
  if (errorMessage || !reservation) {
    return _jsx(Container, {
      sx: { py: 6 },
      children: _jsxs(Stack, {
        spacing: 2,
        children: [
          _jsx(Typography, { color: "error", children: errorMessage || "Reservation not found." }),
          _jsx(Button, {
            variant: "contained",
            onClick: () => navigate("/reservation"),
            children: "Back to Reservations",
          }),
        ],
      }),
    });
  }
  const holdingFeeAmount = Number(reservation.holding_fee_amount).toFixed(2);
  return _jsx(Box, {
    sx: { minHeight: "100vh", background: "#f6f6f6", py: 6 },
    children: _jsx(Container, {
      maxWidth: "sm",
      children: _jsx(Card, {
        sx: { borderRadius: 4 },
        children: _jsx(CardContent, {
          children: _jsxs(Stack, {
            spacing: 3,
            children: [
              _jsx(Typography, {
                variant: "h3",
                sx: { fontWeight: 800 },
                children: "Holding Fee Required",
              }),
              _jsx(Typography, {
                children:
                  "This reservation falls on a high-traffic date and requires a holding fee.",
              }),
              _jsxs(Typography, {
                sx: { fontWeight: 700 },
                children: [
                  "No-shows may be charged a minimum $",
                  holdingFeeAmount,
                  " holding fee.",
                ],
              }),
              _jsx(Typography, {
                sx: { color: "#64748b" },
                children: "Enter your card details to authorize the holding fee.",
              }),
              _jsx(TextField, {
                label: "Card Number",
                value: cardNumber,
                onChange: (e) => setCardNumber(e.target.value),
                fullWidth: true,
                slotProps: {
                  htmlInput: {
                    inputMode: "numeric",
                    maxLength: 19,
                  },
                },
              }),
              _jsxs(FormControl, {
                fullWidth: true,
                children: [
                  _jsx(InputLabel, { children: "Card Type" }),
                  _jsx(Select, {
                    value: cardType,
                    label: "Card Type",
                    onChange: (e) => setCardType(e.target.value),
                    children: CARD_TYPES.map((type) =>
                      _jsx(MenuItem, { value: type, children: type }, type),
                    ),
                  }),
                ],
              }),
              _jsx(TextField, {
                label: "Expiry (MM/YY)",
                placeholder: "12/28",
                value: expiry,
                onChange: (e) => setExpiry(e.target.value),
                fullWidth: true,
                slotProps: {
                  htmlInput: {
                    maxLength: 5,
                  },
                },
              }),
              _jsx(Button, {
                variant: "contained",
                size: "large",
                disabled: isAuthorizing,
                onClick: handleAuthorizeHoldingFee,
                children: isAuthorizing ? "Authorizing..." : "Authorize Holding Fee",
              }),
              paymentError && _jsx(Typography, { color: "error", children: paymentError }),
              _jsx(Button, {
                variant: "outlined",
                onClick: () => navigate("/reservation"),
                children: "Back to Reservation Search",
              }),
            ],
          }),
        }),
      }),
    }),
  });
}
