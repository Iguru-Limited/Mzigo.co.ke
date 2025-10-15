import { Company } from './common'

// Types for the home/landing page
export interface HomePageProps {
  companies?: Company[]
}

export interface HeroSlide {
  id: string
  title: string
  description: string
  image?: string
  cta?: {
    text: string
    href: string
  }
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface LocationData {
  from: string
  to: string
}
