export interface Login {
  email: string;
  password: string;
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
