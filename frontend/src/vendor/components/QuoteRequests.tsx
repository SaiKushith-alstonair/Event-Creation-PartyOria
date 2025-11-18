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
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-blue-900">Budget Allocation</h4>
                      <p className="text-sm text-blue-700">For {selectedRequest.requirement_category}</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
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

      {/* Submit Quote Modal */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Quote</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Quote Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote Amount (₹) *
              </label>
              <Input
                type="number"
                value={quoteForm.quote_amount}
                onChange={(e) => setQuoteForm(prev => ({ ...prev, quote_amount: e.target.value }))}
                placeholder="Enter your quote amount"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to Client
              </label>
              <Textarea
                value={quoteForm.message}
                onChange={(e) => setQuoteForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Add a personal message explaining your quote..."
                rows={3}
              />
            </div>

            {/* What's Included */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's Included
              </label>
              {quoteForm.includes.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={item}
                    onChange={(e) => updateIncludeItem(index, e.target.value)}
                    placeholder="e.g., Professional equipment, Setup & breakdown"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIncludeItem}
              >
                Add Item
              </Button>
            </div>

            {/* What's Not Included */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's Not Included
              </label>
              {quoteForm.excludes.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={item}
                    onChange={(e) => updateExcludeItem(index, e.target.value)}
                    placeholder="e.g., Travel expenses, Additional hours"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExcludeItem}
              >
                Add Item
              </Button>
            </div>

            {/* Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms & Conditions
              </label>
              <Textarea
                value={quoteForm.terms}
                onChange={(e) => setQuoteForm(prev => ({ ...prev, terms: e.target.value }))}
                placeholder="Payment terms, cancellation policy, etc..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitQuote}
                disabled={submitting || !quoteForm.quote_amount}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {submitting ? 'Submitting...' : 'Submit Quote'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}