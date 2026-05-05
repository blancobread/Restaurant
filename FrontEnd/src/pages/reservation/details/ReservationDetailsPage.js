import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography, } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { guestDetailsSchema } from "../../../schema/reservationSchema";
import { useReservationStore } from "../../../store/reservationFlowStore";
import { createReservation } from "../reservationApi";
export default function ReservationDetailsPage() {
    const navigate = useNavigate();
    const selectedTable = useReservationStore((s) => s.selectedTable);
    const setGuestDetails = useReservationStore((s) => s.setGuestDetails);
    const searchCriteria = useReservationStore((state) => state.searchCriteria);
    const [submitError, setSubmitError] = useState("");
    const { control, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(guestDetailsSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
        },
    });
    const onSubmit = async (values) => {
        if (!searchCriteria || !selectedTable) {
            navigate("/reservation");
            return;
        }
        setSubmitError("");
        setGuestDetails(values);
        try {
            const response = await createReservation({
                searchCriteria,
                selectedTable,
                guestInfo: values,
            });
            const reservation = response.data;
            if (reservation.requiresHoldingFee) {
                navigate(`/reservation/payment/${reservation.reservation.id}`);
            }
            else {
                navigate(`/reservation/confirmation/${reservation.reservation.id}`);
            }
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Something went wrong while creating the reservation.";
            setSubmitError(message);
        }
    };
    if (!selectedTable) {
        return (_jsx(Container, { children: _jsx(Typography, { children: "No table selected. Go back." }) }));
    }
    return (_jsx(Box, { sx: { minHeight: "100vh", background: "#f6f6f6", py: 6 }, children: _jsx(Container, { maxWidth: "md", children: _jsxs(Stack, { spacing: 4, children: [_jsx(Typography, { variant: "h3", sx: { fontWeight: 700 }, children: "Enter Your Details" }), _jsx(Card, { sx: { borderRadius: 4 }, children: _jsx(CardContent, { children: _jsxs(Stack, { component: "form", spacing: 3, onSubmit: handleSubmit(onSubmit), children: [_jsxs(Stack, { direction: "row", spacing: 2, children: [_jsx(Controller, { name: "firstName", control: control, render: ({ field }) => (_jsx(TextField, { ...field, fullWidth: true, label: "First Name", error: !!errors.firstName, helperText: errors.firstName?.message })) }), _jsx(Controller, { name: "lastName", control: control, render: ({ field }) => (_jsx(TextField, { ...field, fullWidth: true, label: "Last Name", error: !!errors.lastName, helperText: errors.lastName?.message })) })] }), _jsx(Controller, { name: "email", control: control, render: ({ field }) => (_jsx(TextField, { ...field, fullWidth: true, label: "Email", error: !!errors.email, helperText: errors.email?.message })) }), _jsx(Controller, { name: "phone", control: control, render: ({ field }) => (_jsx(TextField, { ...field, fullWidth: true, label: "Phone Number", error: !!errors.phone, helperText: errors.phone?.message })) }), _jsx(Button, { type: "submit", variant: "contained", size: "large", disabled: isSubmitting, children: isSubmitting ? "Creating Reservation..." : "Continue" }), submitError ? _jsx(Typography, { color: "error", children: submitError }) : null] }) }) })] }) }) }));
}
