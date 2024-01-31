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
export interface Response {
  status: string;
  statusCode: number;
  message: string;
  data: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AddEvent {
  target: HTMLInputElement;
  event_name: string;
}

export interface ServiceManage {
  target: HTMLInputElement;
  service_name: string;
  price: number;
  service_description: string;
}
