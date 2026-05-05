import type { GuestDetails, ReservationOption, ReservationSearchFormValues } from "../../types";
type CreateReservationPayload = {
    searchCriteria: ReservationSearchFormValues;
    selectedTable: ReservationOption;
    guestInfo: GuestDetails;
};
export declare function createReservation(payload: CreateReservationPayload, useLoggedInUser?: boolean): Promise<any>;
export declare function authorizeHoldingFee(reservationId: string, cardData: {
    cardNumber: string;
    cardType: string;
}): Promise<any>;
export declare function searchAvailableTables(values: ReservationSearchFormValues): Promise<any>;
export declare function getReservationById(id: string): Promise<any>;
export {};
