import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authorizeHoldingFee, getReservationById } from "../reservationApi";
export default function ReservationPaymentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAuthorizing, setIsAuthorizing] = useState(false);
    const [paymentError, setPaymentError] = useState("");
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
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Unable to load reservation payment details.";
                setErrorMessage(message);
            }
            finally {
                setIsLoading(false);
            }
        }
        loadReservation();
    }, [id]);
    const handleAuthorizeHoldingFee = async () => {
        if (!reservation)
            return;
        setPaymentError("");
        setIsAuthorizing(true);
        try {
            await authorizeHoldingFee(reservation.id);
            navigate(`/reservation/confirmation/${reservation.id}`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unable to authorize holding fee.";
            setPaymentError(message);
        }
        finally {
            setIsAuthorizing(false);
        }
    };
    if (isLoading) {
        return (_jsx(Container, { sx: { py: 6 }, children: _jsx(Typography, { children: "Loading payment details..." }) }));
    }
    if (errorMessage || !reservation) {
        return (_jsx(Container, { sx: { py: 6 }, children: _jsxs(Stack, { spacing: 2, children: [_jsx(Typography, { color: "error", children: errorMessage || "Reservation not found." }), _jsx(Button, { variant: "contained", onClick: () => navigate("/reservation"), children: "Back to Reservations" })] }) }));
    }
    const holdingFeeAmount = Number(reservation.holding_fee_amount).toFixed(2);
    return (_jsx(Box, { sx: { minHeight: "100vh", background: "#f6f6f6", py: 6 }, children: _jsx(Container, { maxWidth: "sm", children: _jsx(Card, { sx: { borderRadius: 4 }, children: _jsx(CardContent, { children: _jsxs(Stack, { spacing: 3, children: [_jsx(Typography, { variant: "h3", sx: { fontWeight: 800 }, children: "Holding Fee Required" }), _jsx(Typography, { children: "This reservation falls on a designated high-traffic date configured in our reservation system and requires a holding fee." }), _jsxs(Typography, { sx: { fontWeight: 700 }, children: ["No-shows may be charged a minimum $", holdingFeeAmount, " holding fee."] }), _jsx(Typography, { sx: { color: "#64748b" }, children: "For this MVP demo, payment processing is represented by tracking the holding-fee requirement in the database. Full card authorization will be added in a future iteration." }), _jsx(Button, { variant: "contained", size: "large", disabled: isAuthorizing, onClick: handleAuthorizeHoldingFee, children: isAuthorizing ? "Authorizing..." : "Authorize Holding Fee" }), paymentError ? _jsx(Typography, { color: "error", children: paymentError }) : null, _jsx(Button, { variant: "outlined", onClick: () => navigate("/reservation"), children: "Back to Reservation Search" })] }) }) }) }) }));
}
