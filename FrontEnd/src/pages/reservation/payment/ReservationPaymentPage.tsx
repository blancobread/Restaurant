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
import type { ReservationDetails } from "../../../types";
import { authorizeHoldingFee, getReservationById } from "../reservationApi";

const CARD_TYPES = ["VISA", "MASTERCARD", "AMEX"] as const;

export default function ReservationPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
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

  const validateExpiry = (value: string) => {
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

    if (!CARD_TYPES.includes(cardType as (typeof CARD_TYPES)[number])) {
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
    return (
      <Container sx={{ py: 6 }}>
        <Typography>Loading payment details...</Typography>
      </Container>
    );
  }

  if (errorMessage || !reservation) {
    return (
      <Container sx={{ py: 6 }}>
        <Stack spacing={2}>
          <Typography color="error">{errorMessage || "Reservation not found."}</Typography>

          <Button variant="contained" onClick={() => navigate("/reservation")}>
            Back to Reservations
          </Button>
        </Stack>
      </Container>
    );
  }

  const holdingFeeAmount = Number(reservation.holding_fee_amount).toFixed(2);

  return (
    <Box sx={{ minHeight: "100vh", background: "#f6f6f6", py: 6 }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                Holding Fee Required
              </Typography>

              <Typography>
                This reservation falls on a high-traffic date and requires a holding fee.
              </Typography>

              <Typography sx={{ fontWeight: 700 }}>
                No-shows may be charged a minimum ${holdingFeeAmount} holding fee.
              </Typography>

              <Typography sx={{ color: "#64748b" }}>
                Enter your card details to authorize the holding fee.
              </Typography>

              {/* Card Number */}
              <TextField
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                fullWidth
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    maxLength: 19,
                  },
                }}
              />

              {/* Card Type */}
              <FormControl fullWidth>
                <InputLabel>Card Type</InputLabel>
                <Select
                  value={cardType}
                  label="Card Type"
                  onChange={(e) => setCardType(e.target.value)}
                >
                  {CARD_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Expiry (MM/YY)"
                placeholder="12/28"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                fullWidth
                slotProps={{
                  htmlInput: {
                    maxLength: 5,
                  },
                }}
              />

              <Button
                variant="contained"
                size="large"
                disabled={isAuthorizing}
                onClick={handleAuthorizeHoldingFee}
              >
                {isAuthorizing ? "Authorizing..." : "Authorize Holding Fee"}
              </Button>

              {paymentError && <Typography color="error">{paymentError}</Typography>}

              <Button variant="outlined" onClick={() => navigate("/reservation")}>
                Back to Reservation Search
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
