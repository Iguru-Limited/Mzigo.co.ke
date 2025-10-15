import { User } from './common'

// Types for profile page

// API Package Response
export interface Package {
  id: number
  company: number
  office: number
  sender_name: string
  sender_phone: string
  sender_town: string
  receiver_name: string
  receiver_phone: string
  receiver_town: string
  parcel_description: string
  parcel_value: number
  package_size: string
  payment_mode: string
  generated_code: string
  special_instructions?: string
  s_date: string
  s_time: string
  is_suspicious: number
  suspect_score: string | null
  suspect_of_id: number | null
  [key: string]: any
}

export interface UserProfile extends User {
  packages?: Package[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ProfileFormData {
  name: string
  email: string
  phone?: string
  avatar?: string
}

export interface UserStats {
  totalPackages: number
  activePackages: number
  deliveredPackages: number
  totalSpent?: number
}
