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

export interface AuthUser {
  created_at: string;
  email: string;
  name: string;
  phone_number: string;
  profile_image: string;
  status: string;
  updated_at: string;
}

export interface EventManage {
  created_at: string;
  event_manage_id: number | null;
  id: number;
  is_deleted: boolean;
  price: number;
  service_description: string | null;
  service_name: string;
  updated_at: string;
  user_id: number;
}

export interface ManageServiceData {
  auth_user: AuthUser;
  created_at: string;
  event_manage: EventManage | null;
  event_manage_id: number;
  id: number;
  price: number;
  service_description: string | null;
  service_name: string;
  updated_at: string;
  user_id: number;
}
