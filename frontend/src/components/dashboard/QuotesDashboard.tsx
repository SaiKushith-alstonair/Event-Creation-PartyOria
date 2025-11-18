import React from "react"
import QuoteStatus from "./QuoteStatus"

interface Quote {
  id: number
  vendor: {
    name: string
    business: string
    location: string
    experience: string
  }
  requirement_category: string
  quote_amount: number
  message: string
  includes: string[]
  excludes: string[]
  terms: string
  valid_until: string
  submitted_at: string
}

interface QuotesDashboardProps {
  eventId: number
  eventName: string
  onQuoteAccepted?: () => void
}

export default function QuotesDashboard({ eventId, eventName, onQuoteAccepted }: QuotesDashboardProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quote Management</h1>
        <p className="text-gray-600">Track your quote requests and vendor responses for {eventName}</p>
      </div>
      
      <QuoteStatus eventId={eventId} eventName={eventName} />
    </div>
  )
}