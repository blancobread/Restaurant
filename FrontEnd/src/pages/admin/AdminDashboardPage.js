import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  completeReservationForAdmin,
  getAllReservationsForAdmin,
  markReservationNoShowForAdmin,
} from "./adminApi";
export default function AdminDashboardPage() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingReservationId, setUpdatingReservationId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeCompleteId, setActiveCompleteId] = useState(null);
  const [amountSpent, setAmountSpent] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  async function loadReservations() {
    try {
      setErrorMessage("");
      const response = await getAllReservationsForAdmin();
      setReservations(response.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load admin reservations.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    loadReservations();
  }, []);
  function openCompleteForm(reservationId) {
    setActiveCompleteId(reservationId);
    setAmountSpent("");
    setPaymentMethod("CASH");
    setErrorMessage("");
    setSuccessMessage("");
  }
  function closeCompleteForm() {
    setActiveCompleteId(null);
    setAmountSpent("");
    setPaymentMethod("CASH");
  }
  async function handleCompleteReservation(reservationId) {
    const numericAmountSpent = Number(amountSpent);
    if (amountSpent.trim() === "" || Number.isNaN(numericAmountSpent) || numericAmountSpent < 0) {
      setErrorMessage("Please enter a valid amount spent.");
      return;
    }
    try {
      setUpdatingReservationId(reservationId);
      setErrorMessage("");
      setSuccessMessage("");
      await completeReservationForAdmin(reservationId, numericAmountSpent, paymentMethod);
      setSuccessMessage("Reservation marked as completed.");
      closeCompleteForm();
      await loadReservations();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to complete reservation.";
      setErrorMessage(message);
    } finally {
      setUpdatingReservationId("");
    }
  }
  async function handleMarkNoShow(reservationId) {
    try {
      setUpdatingReservationId(reservationId);
      setErrorMessage("");
      setSuccessMessage("");
      await markReservationNoShowForAdmin(reservationId);
      setSuccessMessage("Reservation marked as no-show.");
      await loadReservations();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to mark reservation as no-show.";
      setErrorMessage(message);
    } finally {
      setUpdatingReservationId("");
    }
  }
  const combinationReservations = reservations.filter(
    (reservation) => reservation.tables_need_combining,
  );
  const visibleReservations = filter === "combined" ? combinationReservations : reservations;
  if (isLoading) {
    return _jsx(Container, {
      sx: { py: 6 },
      children: _jsx(Typography, { children: "Loading admin dashboard..." }),
    });
  }
  return _jsx(Box, {
    sx: { minHeight: "100vh", background: "#f6f6f6", py: 6 },
    children: _jsx(Container, {
      maxWidth: "lg",
      children: _jsxs(Stack, {
        spacing: 4,
        children: [
          _jsxs(Box, {
            children: [
              _jsx(Typography, {
                variant: "h3",
                sx: { fontWeight: 800 },
                children: "Admin Dashboard",
              }),
              _jsx(Typography, {
                sx: { color: "#475569", mt: 1 },
                children: "View reservations and table setup requirements.",
              }),
            ],
          }),
          errorMessage ? _jsx(Alert, { severity: "error", children: errorMessage }) : null,
          successMessage ? _jsx(Alert, { severity: "success", children: successMessage }) : null,
          _jsx(Card, {
            sx: { borderRadius: 4 },
            children: _jsx(CardContent, {
              children: _jsxs(Stack, {
                spacing: 1,
                children: [
                  _jsx(Typography, {
                    variant: "h5",
                    sx: { fontWeight: 700 },
                    children: "Owner Setup Alerts",
                  }),
                  _jsxs(Stack, {
                    direction: "row",
                    spacing: 2,
                    sx: { mt: 2, justifyContent: "center" },
                    children: [
                      _jsx(Button, {
                        variant: filter === "all" ? "contained" : "outlined",
                        onClick: () => setFilter("all"),
                        children: "View All Reservations",
                      }),
                      _jsx(Button, {
                        variant: filter === "combined" ? "contained" : "outlined",
                        color: "warning",
                        onClick: () => setFilter("combined"),
                        children: "View Combine Table Alerts",
                      }),
                    ],
                  }),
                  _jsxs(Typography, {
                    sx: { color: "#475569" },
                    children: [
                      combinationReservations.length,
                      " reservation(s) require tables to be combined.",
                    ],
                  }),
                ],
              }),
            }),
          }),
          _jsx(Stack, {
            spacing: 2,
            children:
              visibleReservations.length === 0
                ? _jsx(Card, {
                    sx: { borderRadius: 4 },
                    children: _jsx(CardContent, {
                      children: _jsx(Typography, {
                        sx: { color: "#64748b" },
                        children: "No reservations match this filter.",
                      }),
                    }),
                  })
                : visibleReservations.map((reservation) => {
                    const tableNumbers = reservation.reservation_tables
                      .map((item) => item.restaurant_tables.table_number)
                      .join(" + ");
                    const formattedDate = new Date(reservation.reservation_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC",
                      },
                    );
                    const formatTimeSlot = (time) => {
                      const start = dayjs(time);
                      const end = start.add(1, "hour");
                      return `${start.format("h:mm A")} - ${end.format("h:mm A")}`;
                    };
                    const formattedTime = formatTimeSlot(reservation.reservation_time);
                    const isConfirmedReservation = reservation.status === "CONFIRMED";
                    const isUpdatingThisReservation = updatingReservationId === reservation.id;
                    return _jsx(
                      Card,
                      {
                        sx: { borderRadius: 4 },
                        children: _jsx(CardContent, {
                          children: _jsxs(Stack, {
                            spacing: 2,
                            children: [
                              _jsxs(Stack, {
                                sx: {
                                  justifyContent: "space-between",
                                  flexDirection: { xs: "column", sm: "row" },
                                },
                                spacing: 2,
                                children: [
                                  _jsxs(Box, {
                                    children: [
                                      _jsx(Typography, {
                                        variant: "h6",
                                        sx: { fontWeight: 700 },
                                        children: reservation.guest_name || "Guest Reservation",
                                      }),
                                      _jsxs(Typography, {
                                        sx: { color: "#64748b" },
                                        children: [formattedDate, " at ", formattedTime],
                                      }),
                                    ],
                                  }),
                                  _jsxs(Stack, {
                                    sx: {
                                      flexDirection: "row",
                                      alignItems: "flex-end",
                                      gap: "10px",
                                      flexWrap: "wrap",
                                    },
                                    spacing: 1,
                                    children: [
                                      _jsx(Chip, { label: reservation.status }),
                                      reservation.tables_need_combining
                                        ? _jsx(Chip, {
                                            label: "Owner Action: Combine Tables",
                                            color: "warning",
                                          })
                                        : _jsx(Chip, { label: "Single Table", color: "success" }),
                                      reservation.requires_holding_fee
                                        ? _jsx(Chip, {
                                            label: reservation.holding_fee_paid
                                              ? "Holding Fee Paid"
                                              : "Holding Fee Pending",
                                            color: reservation.holding_fee_paid
                                              ? "success"
                                              : "warning",
                                          })
                                        : null,
                                    ],
                                  }),
                                ],
                              }),
                              _jsxs(Typography, {
                                children: ["Guests: ", reservation.number_of_guests],
                              }),
                              _jsxs(Typography, {
                                children: ["Table(s): ", tableNumbers || "Not assigned"],
                              }),
                              _jsxs(Typography, {
                                children: ["Email: ", reservation.guest_email || "N/A"],
                              }),
                              _jsxs(Typography, {
                                children: ["Phone: ", reservation.guest_phone || "N/A"],
                              }),
                              reservation.tables_need_combining
                                ? _jsxs(Alert, {
                                    severity: "warning",
                                    children: [
                                      "Owner notification: combine tables ",
                                      tableNumbers,
                                      " for this reservation before the guest arrives.",
                                    ],
                                  })
                                : null,
                              isConfirmedReservation
                                ? _jsxs(Stack, {
                                    direction: "row",
                                    spacing: 2,
                                    children: [
                                      _jsx(Button, {
                                        variant: "contained",
                                        color: "success",
                                        disabled: isUpdatingThisReservation,
                                        onClick: () => openCompleteForm(reservation.id),
                                        children: "Mark Completed",
                                      }),
                                      _jsx(Button, {
                                        variant: "outlined",
                                        color: "error",
                                        disabled: isUpdatingThisReservation,
                                        onClick: () => handleMarkNoShow(reservation.id),
                                        children: "Mark No Show",
                                      }),
                                    ],
                                  })
                                : _jsx(Typography, {
                                    sx: { color: "#64748b" },
                                    children: "Actions available only for CONFIRMED reservations.",
                                  }),
                              activeCompleteId === reservation.id
                                ? _jsx(Box, {
                                    sx: {
                                      mt: 2,
                                      p: 2,
                                      border: "1px solid #e2e8f0",
                                      borderRadius: 3,
                                      background: "#ffffff",
                                    },
                                    children: _jsxs(Stack, {
                                      spacing: 2,
                                      children: [
                                        _jsx(Typography, {
                                          variant: "h6",
                                          sx: { fontWeight: 700 },
                                          children: "Complete Reservation",
                                        }),
                                        _jsx(TextField, {
                                          label: "Amount Spent",
                                          type: "number",
                                          value: amountSpent,
                                          onChange: (event) => setAmountSpent(event.target.value),
                                          fullWidth: true,
                                        }),
                                        _jsxs(FormControl, {
                                          children: [
                                            _jsx(FormLabel, { children: "Payment Method" }),
                                            _jsxs(RadioGroup, {
                                              row: true,
                                              value: paymentMethod,
                                              onChange: (event) =>
                                                setPaymentMethod(event.target.value),
                                              children: [
                                                _jsx(FormControlLabel, {
                                                  value: "CASH",
                                                  control: _jsx(Radio, {}),
                                                  label: "Cash",
                                                }),
                                                _jsx(FormControlLabel, {
                                                  value: "CREDIT",
                                                  control: _jsx(Radio, {}),
                                                  label: "Credit",
                                                }),
                                                _jsx(FormControlLabel, {
                                                  value: "CHECK",
                                                  control: _jsx(Radio, {}),
                                                  label: "Check",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        _jsxs(Stack, {
                                          direction: "row",
                                          spacing: 2,
                                          children: [
                                            _jsx(Button, {
                                              variant: "contained",
                                              color: "success",
                                              disabled: isUpdatingThisReservation,
                                              onClick: () =>
                                                handleCompleteReservation(reservation.id),
                                              children: "Submit Completion",
                                            }),
                                            _jsx(Button, {
                                              variant: "outlined",
                                              disabled: isUpdatingThisReservation,
                                              onClick: closeCompleteForm,
                                              children: "Cancel",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  })
                                : null,
                            ],
                          }),
                        }),
                      },
                      reservation.id,
                    );
                  }),
          }),
        ],
      }),
    }),
  });
}
