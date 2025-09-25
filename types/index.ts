export interface Package {
  id: string
  trackingNumber: string
  status: string
  origin: string
  destination: string
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  id: string
  name: string
  logo?: string
  description?: string
  rating?: number
  services: string[]
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
}

export interface NavigationItem {
  title: string
  href: string
  disabled?: boolean
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}