import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReservationById } from "../reservationApi";
export default function ReservationConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
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
        const message = error instanceof Error ? error.message : "Unable to load reservation.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadReservation();
  }, [id]);
  if (isLoading) {
    return _jsx(Container, {
      sx: { py: 6 },
      children: _jsx(Typography, { children: "Loading reservation confirmation..." }),
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
  const tableNumbers = reservation.reservation_tables
    .map((item) => item.restaurant_tables.table_number)
    .join(" + ");
  const formattedDate = dayjs(reservation.reservation_date).format("MMMM D, YYYY");
  const formatTimeSlot = (time) => {
    const start = dayjs(time);
    const end = start.add(1, "hour");
    return `${start.format("h:mm A")} - ${end.format("h:mm A")}`;
  };
  const formattedTime = formatTimeSlot(reservation.reservation_time);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isRegisteredUser =
    !!localStorage.getItem("token") &&
    !!reservation?.users &&
    reservation?.guest_email?.toLowerCase().trim() ===
      (storedUser?.email || storedUser?.userEmail || "").toLowerCase().trim();
  return _jsx(Box, {
    sx: { minHeight: "100vh", background: "#f6f6f6", py: 6 },
    children: _jsx(Container, {
      maxWidth: "md",
      children: _jsxs(Stack, {
        spacing: 4,
        children: [
          _jsxs(Box, {
            children: [
              _jsxs(Typography, {
                variant: "h3",
                sx: { fontWeight: 800 },
                children: [
                  "Thank you ",
                  reservation.guest_name,
                  ", your reservation is confirmed.",
                ],
              }),
              _jsxs(Typography, {
                sx: { color: "#475569", mt: 1 },
                children: ["Confirmation ID: ", reservation.id],
              }),
            ],
          }),
          !isRegisteredUser
            ? _jsx(Card, {
                sx: { marginTop: 4, borderRadius: 4 },
                children: _jsx(CardContent, {
                  children: _jsxs(Stack, {
                    spacing: 2,
                    children: [
                      _jsx(Typography, {
                        variant: "h5",
                        sx: { fontWeight: 700 },
                        children: "Create an Account",
                      }),
                      _jsx(Typography, {
                        sx: { color: "#475569" },
                        children:
                          "Create an account to manage this reservation, view your reservation history, earn dining points, and save your preferences for faster bookings in the future.",
                      }),
                      _jsxs(Stack, {
                        direction: { xs: "column", sm: "row" },
                        spacing: 2,
                        sx: { justifyContent: "center" },
                        children: [
                          _jsx(Button, {
                            variant: "contained",
                            onClick: () =>
                              navigate("/register", {
                                state: {
                                  name: reservation.guest_name,
                                  email: reservation.guest_email,
                                  phone: reservation.guest_phone,
                                },
                              }),
                            children: "Create Account",
                          }),
                          _jsx(Button, {
                            variant: "outlined",
                            onClick: () => navigate("/reservation"),
                            children: "Continue as Guest",
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              })
            : null,
          _jsx(Card, {
            sx: { borderRadius: 4 },
            children: _jsx(CardContent, {
              children: _jsxs(Stack, {
                spacing: 2,
                children: [
                  _jsx(Typography, {
                    variant: "h5",
                    sx: { fontWeight: 700 },
                    children: "Reservation Details",
                  }),
                  _jsxs(Typography, { children: ["Name: ", reservation.guest_name] }),
                  _jsxs(Typography, { children: ["Email: ", reservation.guest_email] }),
                  _jsxs(Typography, { children: ["Phone: ", reservation.guest_phone] }),
                  _jsxs(Typography, { children: ["Date: ", formattedDate] }),
                  _jsxs(Typography, { children: ["Time: ", formattedTime] }),
                  _jsxs(Typography, { children: ["Guests: ", reservation.number_of_guests] }),
                  _jsxs(Typography, { children: ["Table(s): ", tableNumbers] }),
                  _jsxs(Typography, {
                    children: ["Status: ", reservation.status?.replace("_", " ")],
                  }),
                  reservation.requires_holding_fee
                    ? _jsxs(Typography, {
                        children: [
                          "Holding Fee Required: $",
                          Number(reservation.holding_fee_amount).toFixed(2),
                        ],
                      })
                    : _jsx(Typography, { children: "No holding fee required." }),
                  _jsx(Typography, {
                    sx: { color: "#475569" },
                    children: "A confirmation email will be sent shortly.",
                  }),
                ],
              }),
            }),
          }),
          _jsxs(Stack, {
            spacing: 2,
            sx: { alignItems: "center" },
            children: [
              _jsx(Button, {
                variant: "contained",
                onClick: () => navigate("/reservation"),
                sx: { width: 300 },
                children: "Make Another Reservation",
              }),
              isRegisteredUser
                ? _jsx(Button, {
                    variant: "outlined",
                    onClick: () => navigate("/profile"),
                    sx: { width: 300 },
                    children: "View Profile",
                  })
                : _jsx(Typography, {
                    sx: { color: "#475569", textAlign: "center" },
                    children:
                      "Please save your Confirmation ID or email to look up your reservation later.",
                  }),
            ],
          }),
        ],
      }),
    }),
  });
}
