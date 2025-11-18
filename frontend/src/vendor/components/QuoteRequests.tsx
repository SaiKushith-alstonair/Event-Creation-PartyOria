import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { FileText, Clock, Users, MapPin, Calendar, DollarSign, Send } from "lucide-react"
import { apiService } from "../services/api"

interface QuoteRequest {
  id: number
  event_name: string
  event_type: string
  requirement_category: string
  budget_allocation: number
  event_date: string
  location: string
  attendees: number
  client_name: string
  status: string
  sent_at: string
  expires_at: string
  has_responded: boolean
}

interface QuoteRequestDetail {
  id: number
  event: {
    name: string
    type: string
    date: string
    duration: string
    location: string
    attendees: number
    description: string
    special_requirements: any
  }
  client: {
    name: string
    email: string
    phone: string
  }
  requirement_category: string
  budget_allocation: number
  expires_at: string
  has_responded: boolean
}

export default function QuoteRequests() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequestDetail | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Quote form data
  const [quoteForm, setQuoteForm] = useState({
    quote_amount: '',
    message: '',
    includes: [''],
    excludes: [''],
    terms: ''
  })

  useEffect(() => {
    loadQuoteRequests()
  }, [])

  const loadQuoteRequests = async () => {
    try {
      setLoading(true)
      const response = await apiService.getVendorQuoteRequests()
      if (response.success) {
        setQuoteRequests(response.quote_requests)
      }
    } catch (error) {
      console.error('Failed to load quote requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadQuoteDetail = async (quoteId: number) => {
    try {
      const response = await apiService.getQuoteRequestDetail(quoteId)
      if (response.success) {
        setSelectedRequest(response.quote_request)
        setIsDetailModalOpen(true)
      }
    } catch (error) {
      console.error('Failed to load quote detail:', error)
    }
  }

  const handleSubmitQuote = async () => {
    if (!selectedRequest || !quoteForm.quote_amount) return

    try {
      setSubmitting(true)
      
      const quoteData = {
        quote_amount: parseFloat(quoteForm.quote_amount),
        message: quoteForm.message,
        includes: quoteForm.includes.filter(item => item.trim()),
        excludes: quoteForm.excludes.filter(item => item.trim()),
        terms: quoteForm.terms
      }

      const response = await apiService.submitQuote(selectedRequest.id, quoteData)
      
      if (response.success) {
        // Refresh quote requests
        await loadQuoteRequests()
        setIsSubmitModalOpen(false)
        setIsDetailModalOpen(false)
        
        // Reset form
        setQuoteForm({
          quote_amount: '',
          message: '',
          includes: [''],
          excludes: [''],
          terms: ''
        })
      }
    } catch (error) {
      console.error('Failed to submit quote:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'viewed': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'responded': return 'bg-green-100 text-green-800 border-green-200'
      case 'expired': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const addIncludeItem = () => {
    setQuoteForm(prev => ({
      ...prev,
      includes: [...prev.includes, '']
    }))
  }

  const addExcludeItem = () => {
    setQuoteForm(prev => ({
      ...prev,
      excludes: [...prev.excludes, '']
    }))
  }

  const updateIncludeItem = (index: number, value: string) => {
    setQuoteForm(prev => ({
      ...prev,
      includes: prev.includes.map((item, i) => i === index ? value : item)
    }))
  }

  const updateExcludeItem = (index: number, value: string) => {
    setQuoteForm(prev => ({
      ...prev,
      excludes: prev.excludes.map((item, i) => i === index ? value : item)
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2">Loading quote requests...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quote Requests</h2>
          <p className="text-gray-600">Manage incoming quote requests from customers</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {quoteRequests.length} requests
        </Badge>
      </div>

      {quoteRequests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quote requests</h3>
            <p className="text-gray-600">
              You'll receive notifications when customers request quotes for your services.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quoteRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {request.event_name}
                        </h3>
                        <p className="text-sm text-gray-600">{request.event_type}</p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(request.budget_allocation)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(request.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{request.attendees} guests</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{request.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Expires {formatDate(request.expires_at)}</span>
                      </div>
                      <div>Client: {request.client_name}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadQuoteDetail(request.id)}
                    >
                      View Details
                    </Button>
                    {!request.has_responded && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          loadQuoteDetail(request.id)
                          setIsSubmitModalOpen(true)
                        }}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Submit Quote
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quote Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRequest.event.name} - Quote Request</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Category-Specific Notice */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <strong>Category-Specific Quote:</strong> This request is specifically for <strong>{selectedRequest.requirement_category}</strong> services only. 
                        You are not required to provide other services like venues, photography, etc.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Type:</strong> {selectedRequest.event.type}</div>
                      <div><strong>Date:</strong> {formatDate(selectedRequest.event.date)}</div>
                      <div><strong>Duration:</strong> {selectedRequest.event.duration} hours</div>
                      <div><strong>Location:</strong> {selectedRequest.event.location}</div>
                      <div><strong>Attendees:</strong> {selectedRequest.event.attendees}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Client Details</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Name:</strong> {selectedRequest.client.name}</div>
                      <div><strong>Email:</strong> {selectedRequest.client.email}</div>
                      <div><strong>Phone:</strong> {selectedRequest.client.phone}</div>
                    </div>
                  </div>
                </div>

                {/* Budget & Category */}
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-green-900">Your Allocated Budget</h4>
                      <p className="text-sm text-green-700">Specifically for {selectedRequest.requirement_category} only</p>
                      <p className="text-xs text-green-600 mt-1">This is your portion of the total event budget</p>
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {formatCurrency(selectedRequest.budget_allocation)}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedRequest.event.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Event Description</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {selectedRequest.event.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  {!selectedRequest.has_responded && (
                    <Button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Submit Quote
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Submit Quote Modal - Enhanced UI */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 -m-6 mb-6 rounded-t-lg">
            <DialogTitle className="text-xl font-semibold">Submit Your Quote</DialogTitle>
            <p className="text-green-100 text-sm mt-1">
              Provide a detailed quote for {selectedRequest?.event.name}
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Event Summary Card */}
            {selectedRequest && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200">
                <h4 className="font-medium text-gray-900 mb-2">📋 Your Quote Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Your Budget:</span>
                    <div className="font-semibold text-green-600">
                      {formatCurrency(selectedRequest.budget_allocation)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Event Date:</span>
                    <div className="font-medium">{formatDate(selectedRequest.event.date)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Guest Count:</span>
                    <div className="font-medium">{selectedRequest.event.attendees}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Your Service:</span>
                    <div className="font-medium text-blue-600">{selectedRequest.requirement_category}</div>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  💡 <strong>Note:</strong> Quote only for {selectedRequest.requirement_category} services. Other services handled by other vendors.
                </div>
              </div>
            )}

            {/* Quote Amount - Enhanced */}
            <div className="bg-white border-2 border-green-200 rounded-lg p-4">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                💰 Your {selectedRequest?.requirement_category} Quote Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                <Input
                  type="number"
                  value={quoteForm.quote_amount}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, quote_amount: e.target.value }))}
                  placeholder="Enter your quote amount"
                  className="pl-8 text-lg font-semibold h-12 border-green-300 focus:border-green-500"
                  required
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Enter your quote for <strong>{selectedRequest?.requirement_category}</strong> services only (Budget: {selectedRequest ? formatCurrency(selectedRequest.budget_allocation) : ''})
              </p>
            </div>

            {/* Message - Enhanced */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                💬 Personal Message
              </label>
              <Textarea
                value={quoteForm.message}
                onChange={(e) => setQuoteForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Hi! I'm excited to work on your event. Here's what I can offer..."
                rows={4}
                className="border-blue-300 focus:border-blue-500"
              />
              <p className="text-sm text-blue-600 mt-2">
                Add a personal touch to connect with the client
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* What's Included - Enhanced */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  ✅ What's Included
                </label>
                <div className="space-y-2">
                  {quoteForm.includes.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateIncludeItem(index, e.target.value)}
                        placeholder="e.g., Professional equipment, Setup & breakdown"
                        className="border-green-300 focus:border-green-500"
                      />
                      {quoteForm.includes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setQuoteForm(prev => ({
                            ...prev,
                            includes: prev.includes.filter((_, i) => i !== index)
                          }))}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addIncludeItem}
                    className="w-full border-green-300 text-green-700 hover:bg-green-100"
                  >
                    + Add Service
                  </Button>
                </div>
              </div>

              {/* What's Not Included - Enhanced */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  ❌ What's Not Included
                </label>
                <div className="space-y-2">
                  {quoteForm.excludes.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateExcludeItem(index, e.target.value)}
                        placeholder="e.g., Travel expenses, Additional hours"
                        className="border-orange-300 focus:border-orange-500"
                      />
                      {quoteForm.excludes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setQuoteForm(prev => ({
                            ...prev,
                            excludes: prev.excludes.filter((_, i) => i !== index)
                          }))}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExcludeItem}
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    + Add Exclusion
                  </Button>
                </div>
              </div>
            </div>

            {/* Terms - Enhanced */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                📋 Terms & Conditions
              </label>
              <Textarea
                value={quoteForm.terms}
                onChange={(e) => setQuoteForm(prev => ({ ...prev, terms: e.target.value }))}
                placeholder="• 50% advance payment required\n• Final payment due on event day\n• Cancellation 48 hours prior for full refund\n• Additional hours charged at ₹X per hour"
                rows={4}
                className="border-purple-300 focus:border-purple-500"
              />
              <p className="text-sm text-purple-600 mt-2">
                Clear terms help avoid misunderstandings later
              </p>
            </div>

            {/* Actions - Enhanced */}
            <div className="flex gap-3 pt-6 border-t-2">
              <Button
                variant="outline"
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 h-12 text-lg"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitQuote}
                disabled={submitting || !quoteForm.quote_amount}
                className="flex-1 h-12 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Quote
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}