import { PreferredContact } from '@/enums/landing'

export interface ContactFormData {
  fullName: string
  email: string
  phone: string
  subject: string
  message: string
  courseName?: string
  preferredContact: PreferredContact
}

export interface CategoriesContentProps {
  categories: string[]
}
