// Common types used across the application

export interface Company {
  id: string | number
  name: string
  logo?: string
  description?: string
  rating?: number
  services?: string[]
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

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
