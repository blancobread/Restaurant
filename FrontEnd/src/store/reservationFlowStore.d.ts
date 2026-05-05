import type { GuestDetails, GuestReservationDetailsFormValues, ReservationConfirmation, ReservationFlowState, ReservationMode, ReservationOption, ReservationSearchFormValues } from "../types";
type ReservationActions = {
    setReservationMode: (mode: ReservationMode) => void;
    setSearchCriteria: (values: ReservationSearchFormValues) => void;
    setGuestDetails: (details: GuestDetails) => void;
    setAvailableTables: (options: ReservationOption[]) => void;
    selectTable: (option: ReservationOption | null) => void;
    setGuestInfo: (details: GuestReservationDetailsFormValues) => void;
    setReservationConfirmation: (confirmation: ReservationConfirmation) => void;
    clearAvailableTables: () => void;
    clearSelectedTable: () => void;
    resetReservation: () => void;
};
type ReservationStore = ReservationFlowState & ReservationActions;
export declare const useReservationStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ReservationStore>>;
export {};
