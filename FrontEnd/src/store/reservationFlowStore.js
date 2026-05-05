import { create } from "zustand";
const initialState = {
    searchCriteria: null,
    availableTables: [],
    selectedTable: null,
    guestInfo: null,
    reservationConfirmation: null,
    guestDetails: null,
};
export const useReservationStore = create()((set) => ({
    ...initialState,
    setGuestDetails: (details) => set(() => ({
        guestDetails: details,
    })),
    setSearchCriteria: (values) => set(() => ({
        searchCriteria: values,
    })),
    setAvailableTables: (options) => set(() => ({
        availableTables: options,
    })),
    selectTable: (option) => set(() => ({
        selectedTable: option,
    })),
    setGuestInfo: (details) => set(() => ({
        guestInfo: details,
    })),
    setReservationConfirmation: (confirmation) => set(() => ({
        reservationConfirmation: confirmation,
    })),
    clearAvailableTables: () => set(() => ({
        availableTables: [],
    })),
    clearSelectedTable: () => set(() => ({
        selectedTable: null,
    })),
    resetReservation: () => set(() => ({
        ...initialState,
    })),
}));
