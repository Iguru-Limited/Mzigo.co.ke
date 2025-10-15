import { PipelineStatus } from '@/lib/pipelineManager'

// Types for track-mzigo page
export interface Package {
  id: string
  trackingNumber: string
  status: string
  origin: string
  destination: string
  createdAt: Date
  updatedAt: Date
  pipelineStatus?: PipelineStatus
}

export interface Parcel {
  senderName: string
  senderPhone: string
  senderStage: string
  receiverName: string
  receiverPhone: string
  receiverStage: string
  parcelDescription: string
  parcelValue: string
  paymentMethod: string
  trackingNumber?: string
  company: string
  pipelineStatus?: PipelineStatus
  createdAt?: string
}

export interface Order {
  class: string
  code: string
  orderId: string
  deliveryDate: string
  status: string
  details: string
  estimatedDelivery?: string
  currentLocation?: string
  senderName?: string
  receiverName?: string
  senderStage?: string
  receiverStage?: string
  parcelDescription?: string
  parcelValue?: string
  company?: string
  pipelineStatus?: PipelineStatus
  createdAt?: string
}

export interface TrackingSearchResult {
  found: boolean
  order?: Order
  error?: string
}

export interface StatusUpdateData {
  trackingNumber: string
  newStatus: string
  timestamp?: string
}
