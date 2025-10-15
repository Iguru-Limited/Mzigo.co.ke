import { Company } from './common'

// Types for send-mzigo page
export interface SendPackageFormData {
  senderName: string
  senderPhone: string
  senderStage: string
  receiverName: string
  receiverPhone: string
  receiverStage: string
  parcelDescription: string
  parcelValue: string
  paymentMethod: string
  company: string
}

export interface PackageDestination {
  id: string
  name: string
  region?: string
  country?: string
}

export interface PackageRequirement {
  id: string
  title: string
  description: string
  required: boolean
  category?: string
}

export interface CompanyCardProps {
  company: Company
  onSelect?: (company: Company) => void
  selected?: boolean
}
