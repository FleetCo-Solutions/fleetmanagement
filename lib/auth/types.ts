export interface AuthenticatedUser {
  id?: string;
  companyId: string;
  role?: string;
  type: "user" | "driver" | "systemUser";
}

export interface AuthenticatedError {
  timestamp: Date;
  message: string;
}
