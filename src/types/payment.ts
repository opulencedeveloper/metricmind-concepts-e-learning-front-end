export enum PaymentStatus {
  Success = 'success',
  Pending = 'pending',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

export interface Payment {
  _id: string;
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  provider: string;
  providerTransactionId?: string;
  providerReference: string;
  verificationMethod: string;
  enrollmentCreated: boolean;
  paidAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitiatePaymentResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface VerifyPaymentResponse {
  status: string;
  enrollmentCreated: boolean;
}

export interface PaymentHistoryResponse {
  payments: Payment[];
  total: number;
}

export interface CheckoutProps {
  courseId: string;
  courseTitle: string;
  price: number;
  currency: string;
}

export interface PaymentSuccessProps {
  reference: string;
  courseId: string;
}
