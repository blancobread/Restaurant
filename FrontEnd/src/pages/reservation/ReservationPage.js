import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { reservationSearchSchema } from "../../schema/reservationSchema";
import { useReservationStore } from "../../store/reservationFlowStore";
import { guestNumberOptions } from "../../types";
import { searchAvailableTables } from "./reservationApi";
const generateTimeSlots = () => {
  const slots = [];
  let start = 10 * 60; // 10:00 AM
  const end = 22 * 60; // 10:00 PM
  while (start < end) {
    const endSlot = start + 60;
    const format = (mins) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      const ampm = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
    };
    slots.push({
      label: `${format(start)} - ${format(endSlot)}`,
      value: `${Math.floor(start / 60)
        .toString()
        .padStart(2, "0")}:${(start % 60).toString().padStart(2, "0")}`,
    });
    start += 60;
  }
  return slots;
};
const timeSlots = generateTimeSlots();
export default function ReservationPage() {
  const navigate = useNavigate();
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const today = new Date().toLocaleDateString("en-CA");
  const setSearchCriteria = useReservationStore((state) => state.setSearchCriteria);
  const setAvailableTables = useReservationStore((state) => state.setAvailableTables);
  const selectTable = useReservationStore((state) => state.selectTable);
  const availableTables = useReservationStore((state) => state.availableTables);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reservationSearchSchema),
    defaultValues: {
      date: "",
      time: "",
      numberOfGuests: 2,
    },
  });
  function mapBackendResultsToOptions(data, numberOfGuests) {
    const directTableOptions = data.availableTables
      .filter((table) => table.capacity >= numberOfGuests)
      .map((table) => ({
        id: `table-option-${table.id}`,
        tableIds: [table.id],
        tableNumbers: [table.table_number],
        totalCapacity: table.capacity,
        tablesNeedCombining: false,
        wastedSeats: table.capacity - numberOfGuests,
      }));
    const combinationOptions = data.suggestedCombinations
      .filter((combo) => combo.tables.length > 1)
      .map((combo, index) => ({
        id: `combo-option-${index}`,
        tableIds: combo.tables.map((table) => table.id),
        tableNumbers: combo.tables.map((table) => table.table_number),
        totalCapacity: combo.totalCapacity,
        tablesNeedCombining: true,
        wastedSeats: combo.totalCapacity - numberOfGuests,
      }));
    return directTableOptions.length > 0 ? directTableOptions : combinationOptions;
  }
  const onSubmit = async (values) => {
    setErrorMessage("");
    const selectedDate = new Date(`${values.date}T00:00:00`);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (selectedDate < todayDate) {
      setErrorMessage("Please select today or a future date.");
      setAvailableTables([]);
      setHasSearched(false);
      return;
    }
    const [hour, minute] = values.time.split(":").map(Number);
    const selectedMinutes = hour * 60 + minute;
    const openingMinutes = 10 * 60;
    const closingMinutes = 22 * 60;
    if (selectedMinutes < openingMinutes || selectedMinutes > closingMinutes) {
      setErrorMessage("Reservations are only allowed between 10:00 AM and 10:00 PM.");
      setAvailableTables([]);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    setIsSearching(true);
    setSearchCriteria(values);
    try {
      const response = await searchAvailableTables(values);
      const options = mapBackendResultsToOptions(response.data, values.numberOfGuests);
      setAvailableTables(options);
    } catch (error) {
      console.error(error);
      setAvailableTables([]);
    } finally {
      setIsSearching(false);
    }
  };
  return _jsx(Box, {
    sx: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f2e7 0%, #f4f4f5 100%)",
    },
    children: _jsx(Container, {
      children: _jsxs(Stack, {
        spacing: 4,
        children: [
          _jsxs(Box, {
            children: [
              _jsx(Typography, {
                variant: "h2",
                sx: { fontWeight: 700, color: "#0f172a" },
                children: "Reserve a Table",
              }),
              _jsx(Typography, {
                variant: "h6",
                sx: { color: "#475569" },
                children: "Choose your date, time, and party size to find available tables.",
              }),
            ],
          }),
          _jsx(Card, {
            sx: { borderRadius: 5, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)" },
            children: _jsx(CardContent, {
              children: _jsxs(Stack, {
                component: "form",
                spacing: 2,
                onSubmit: handleSubmit(onSubmit),
                children: [
                  _jsx(Controller, {
                    name: "date",
                    control: control,
                    render: ({ field }) =>
                      _jsx(TextField, {
                        ...field,
                        fullWidth: true,
                        type: "date",
                        slotProps: {
                          htmlInput: {
                            min: today,
                          },
                        },
                        error: Boolean(errors.date),
                        helperText: errors.date?.message,
                      }),
                  }),
                  _jsx(Controller, {
                    name: "time",
                    control: control,
                    render: ({ field }) =>
                      _jsx(TextField, {
                        ...field,
                        fullWidth: true,
                        select: true,
                        label: "Select Time Slot",
                        value: field.value,
                        onChange: (event) => field.onChange(event.target.value),
                        error: Boolean(errors.time),
                        helperText: errors.time?.message,
                        children: timeSlots.map((slot) =>
                          _jsx(MenuItem, { value: slot.value, children: slot.label }, slot.value),
                        ),
                      }),
                  }),
                  _jsx(Controller, {
                    name: "numberOfGuests",
                    control: control,
                    render: ({ field }) =>
                      _jsx(TextField, {
                        ...field,
                        fullWidth: true,
                        select: true,
                        label: "Number of Guests",
                        value: field.value,
                        onChange: (event) => field.onChange(Number(event.target.value)),
                        error: Boolean(errors.numberOfGuests),
                        helperText: errors.numberOfGuests?.message,
                        children: guestNumberOptions.map((num) =>
                          _jsxs(MenuItem, { value: num, children: [num, " Guests"] }, num),
                        ),
                      }),
                  }),
                  errorMessage &&
                    _jsx(Typography, {
                      color: "error",
                      sx: { fontWeight: 600 },
                      children: errorMessage,
                    }),
                  _jsx(Button, {
                    type: "submit",
                    variant: "contained",
                    size: "large",
                    disabled: isSubmitting || isSearching,
                    sx: {
                      minHeight: 55,
                      borderRadius: 5,
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "1rem",
                      backgroundColor: "#ea580c",
                      "&:hover": { backgroundColor: "#c2410c" },
                    },
                    children: isSearching ? "Searching..." : "Search Available Tables",
                  }),
                ],
              }),
            }),
          }),
          _jsx(Card, {
            sx: { borderRadius: 5, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)" },
            children: _jsx(CardContent, {
              children: _jsxs(Stack, {
                spacing: 2,
                children: [
                  _jsx(Typography, {
                    variant: "h4",
                    sx: { fontWeight: 700, color: "#0f172a" },
                    children: "Available Options",
                  }),
                  !hasSearched
                    ? _jsx(Typography, {
                        variant: "body1",
                        sx: { color: "#64748b" },
                        children: "Search for available tables to see reservation options.",
                      })
                    : isSearching
                      ? _jsx(Typography, {
                          variant: "body1",
                          sx: { color: "#64748b" },
                          children: "Checking table availability...",
                        })
                      : availableTables.length === 0
                        ? _jsx(Typography, {
                            variant: "body1",
                            sx: { color: "#64748b" },
                            children: "No available tables were found for that time.",
                          })
                        : _jsx(Stack, {
                            spacing: 2,
                            children: availableTables.map((option) =>
                              _jsx(
                                Card,
                                {
                                  variant: "outlined",
                                  sx: { borderRadius: 5 },
                                  children: _jsxs(CardContent, {
                                    children: [
                                      _jsxs(Typography, {
                                        variant: "h6",
                                        sx: { fontWeight: 700 },
                                        children: [
                                          "Table Option: ",
                                          option.tableNumbers.join(" + "),
                                        ],
                                      }),
                                      _jsxs(Typography, {
                                        variant: "body2",
                                        sx: { color: "#475569", mt: 1 },
                                        children: ["Capacity: ", option.totalCapacity],
                                      }),
                                      _jsx(Typography, {
                                        variant: "body2",
                                        sx: { color: "#475569" },
                                        children: option.tablesNeedCombining
                                          ? "Tables need to be combined"
                                          : "Single table available",
                                      }),
                                      _jsxs(Typography, {
                                        variant: "body2",
                                        sx: { color: "#475569" },
                                        children: ["Wasted Seats: ", option.wastedSeats],
                                      }),
                                      _jsx(Button, {
                                        variant: "contained",
                                        sx: {
                                          mt: 2,
                                          textTransform: "none",
                                          borderRadius: 5,
                                          fontWeight: 700,
                                        },
                                        onClick: () => {
                                          selectTable(option);
                                          navigate("/reservation/details");
                                        },
                                        children: "Select This Option",
                                      }),
                                    ],
                                  }),
                                },
                                option.id,
                              ),
                            ),
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
