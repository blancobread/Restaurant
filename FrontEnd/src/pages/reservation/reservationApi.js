const API_URL = import.meta.env.VITE_API_URL;
export async function createReservation(payload, useLoggedInUser = false) {
  const requestBody = {
    guestName: `${payload.guestInfo.firstName} ${payload.guestInfo.lastName}`,
    guestEmail: payload.guestInfo.email,
    guestPhone: payload.guestInfo.phone,
    reservationDate: payload.searchCriteria.date,
    reservationTime: payload.searchCriteria.time,
    numberOfGuests: payload.searchCriteria.numberOfGuests,
    selectedTableIds: payload.selectedTable.tableIds,
    specialRequests: payload.guestInfo.specialRequest,
  };
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (useLoggedInUser && token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_URL}/api/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(requestBody),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create reservation");
  }
  return data;
}
export async function authorizeHoldingFee(reservationId, cardData) {
  const response = await fetch(
    `${API_URL}/api/reservations/${reservationId}/authorize-holding-fee`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardData),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to authorize holding fee");
  }
  return data;
}
export async function searchAvailableTables(values) {
  const params = new URLSearchParams({
    date: values.date,
    time: values.time,
    numberOfGuests: String(values.numberOfGuests),
  });
  const url = `${API_URL}/api/reservations/search?${params}`;
  const response = await fetch(url);
  const text = await response.text();
  const data = JSON.parse(text);
  if (!response.ok) {
    throw new Error(data.message || "Failed to search available tables");
  }
  return data;
}
export async function getReservationById(id) {
  const response = await fetch(`${API_URL}/api/reservations/${id}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load reservation");
  }
  return data;
}
