export interface Login {
  email: string;
  password: string;
}

export interface CountOfBookingStatus {
  countOfPendingBooking: number;
  countOfApprovedBooking: number;
  countOfCancelledBooking: number;
  countOfTotalBooking: number;
}
