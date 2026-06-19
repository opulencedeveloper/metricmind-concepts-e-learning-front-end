export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum ApiMessage {
  Error = 'error',
  Success = 'success',
  VerifyEmail = 'verify_email',
  MethodNotAllowed = 'method_not_allowed',
}

export interface ApiResponse<T = any> {
  message: ApiMessage
  description: string
  data?: T
}

export interface HttpError {
  userMessage: string
  statusCode?: number
  originalError?: Error | any
}

export interface HttpRequestConfig {
  url: string
  method: HttpMethod
  body?: any
  params?: Record<string, any>
  headers?: Record<string, string>
  isAuth?: boolean
  successMessage?: string
  errorMessage?: string
  suppressErrorToast?: boolean
  loadingMessage?: string
  baseURL?: string
  contentType?: string
}

export interface HttpRequestConfigProps {
  requestConfig: HttpRequestConfig
  successRes: (response: any) => void
  errorRes?: (response: any) => boolean | void
}

export interface UseHttpReturn {
  isLoading: boolean
  sendHttpRequest: (config: HttpRequestConfigProps) => Promise<any>
  error: string | null
}
