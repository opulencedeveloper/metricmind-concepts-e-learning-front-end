import { Student } from '@/types/auth'
import { Admin } from '@/types/admin'
import { UserType } from '@/types/auth'
import { StorageKey } from '@/enums/storage'

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(StorageKey.AuthToken)
}

export const saveAuthToken = (token: string, userType: UserType = UserType.Student): void => {
  if (typeof window === 'undefined') return

  if (userType === UserType.Admin) {
    localStorage.setItem(StorageKey.AdminToken, token)
    localStorage.setItem(StorageKey.UserType, UserType.Admin)
  } else {
    localStorage.setItem(StorageKey.AuthToken, token)
    localStorage.setItem(StorageKey.UserType, UserType.Student)
  }
}

export const setAuthToken = (token: string): void => {
  saveAuthToken(token, UserType.Student)
}

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(StorageKey.AuthToken)
  localStorage.removeItem(StorageKey.AdminToken)
  localStorage.removeItem(StorageKey.UserType)
}

export const getAuthStudent = (): Student | null => {
  if (typeof window === 'undefined') return null

  const studentJson = localStorage.getItem(StorageKey.StudentData)
  if (!studentJson) return null

  try {
    return JSON.parse(studentJson)
  } catch {
    return null
  }
}

export const setAuthStudent = (student: Student): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(StorageKey.StudentData, JSON.stringify(student))
}

export const removeAuthStudent = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(StorageKey.StudentData)
}

export const getAdminData = (): Admin | null => {
  if (typeof window === 'undefined') return null

  const adminJson = localStorage.getItem(StorageKey.AdminData)
  if (!adminJson) return null

  try {
    return JSON.parse(adminJson)
  } catch {
    return null
  }
}

export const saveAdminData = (admin: Admin): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(StorageKey.AdminData, JSON.stringify(admin))
}

export const removeAdminData = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(StorageKey.AdminData)
}

export const clearAllAuthData = (): void => {
  if (typeof window === 'undefined') return
  // Clear all browser storage
  localStorage.clear()
  sessionStorage.clear()
}

export const getUserType = (): UserType | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(StorageKey.UserType) as UserType | null
}

export const clearAuth = (): void => {
  if (typeof window === 'undefined') return

  removeAuthToken()
  removeAuthStudent()
  removeAdminData()
  sessionStorage.removeItem('redirectAfterLogin')
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  const userType = getUserType()

  if (userType === UserType.Admin) {
    return !!localStorage.getItem(StorageKey.AdminToken)
  }

  return !!localStorage.getItem(StorageKey.AuthToken)
}

export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem(StorageKey.AdminToken)
}
