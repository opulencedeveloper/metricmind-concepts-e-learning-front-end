import { ReactNode } from 'react'

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Ghost = 'ghost',
}

export enum ButtonSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum AlertType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

export enum BadgeVariant {
  Default = 'default',
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
}

export enum ModalSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum LoadingStateType {
  Skeleton = 'skeleton',
  Spinner = 'spinner',
  Pulse = 'pulse',
  Card = 'card',
  Grid = 'grid',
  Checkout = 'checkout',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  disabled?: boolean
  children: ReactNode
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  hoverable?: boolean
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  actions?: ReactNode
  size?: ModalSize
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: ReactNode
}

export interface AlertProps {
  type: AlertType
  message: string
  onClose?: () => void
  dismissible?: boolean
}

export interface LoadingStateProps {
  type?: LoadingStateType
  count?: number
}
