export enum AccountStatus {
  Active = 'active',
  Inactive = 'inactive',
  Suspended = 'suspended',
  Verified = 'verified',
  Pending = 'pending',
}

export enum UserType {
  Student = 'student',
  Instructor = 'instructor',
  Admin = 'admin',
}

export interface Student {
  id: string
  email: string
  fullName: string
  status: AccountStatus
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  student: Student | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

export interface SignupInput {
  email: string
  password: string
  confirmPassword: string
  fullName: string
}

export interface EmailVerifyInput {
  email: string
  otp: string
}

export interface ForgotPasswordInput {
  email: string
}

export interface ResetPasswordInput {
  email: string
  otp: string
  newPassword: string
  confirmPassword: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface ResendVerificationInput {
  email: string
}
