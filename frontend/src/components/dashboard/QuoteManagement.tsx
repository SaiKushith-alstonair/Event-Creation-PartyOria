import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Clock, Users, MapPin, Calendar, Eye, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface QuoteManagementProps {
  onNavigate?: (component: string) => void
}

export default function QuoteManagement({ onNavigate }: QuoteManagementProps = {}) {
  const { toast } = useToast()
  const [quotes, setQuotes] = useState<any[]>([])
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    targeted: 0
  })

  useEffect(() => {
    loadQuotes()
  }, [])

  const loadQuotes = async () => {
    try {
      // Try API first
      const { apiService } = await import('../../services/api')
      const apiQuotes = await apiService.getQuoteRequests()
      setQuotes(apiQuotes)
      
      // Calculate stats
      setStats({
        total: apiQuotes.length,
        pending: apiQuotes.filter(q => q.status === 'pending').length,
        completed: apiQuotes.filter(q => q.status === 'completed').length,
        targeted: apiQuotes.filter(q => q.quote_type === 'targeted').length
      })
    } catch (error) {
      // Fallback to localStorage
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
      if (userStr) {
        const user = JSON.parse(userStr)
        const userId = user.id || user.email || user.username
        const userQuotesKey = `userQuotes_${userId}`
        const localQuotes = JSON.parse(localStorage.getItem(userQuotesKey) || '[]')
        setQuotes(localQuotes)
        
        setStats({
          total: localQuotes.length,
          pending: localQuotes.filter(q => q.status === 'pending').length,
          completed: localQuotes.filter(q => q.status === 'completed').length,
          targeted: localQuotes.filter(q => q.quote_type === 'targeted').length
        })
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'low': return <Clock className="h-4 w-4 text-green-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote)
    setIsDetailModalOpen(true)
  }

  return (
    <div className="p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 mb-6 text-white">
        <h1 className="text-2xl font-semibold text-white mb-2">Quote Management</h1>
        <p className="text-white/90">Track and manage all your quote requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Total Quotes</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</h3>
              </div>
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">{stats.pending}</h3>
              </div>
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">{stats.completed}</h3>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Targeted</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">{stats.targeted}</h3>
              </div>
              <TrendingUp className="h-6 w-6 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotes List */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Quote Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No quote requests yet</p>
              <Button 
                className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                onClick={() => onNavigate?.('dashboard')}
              >
                Request Your First Quote
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote, index) => (
                <div key={quote.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {quote.event_name || `${quote.event_type} Event`}
                        </h3>
                        <Badge className={getStatusColor(quote.status)}>
                          {quote.status?.replace('_', ' ') || 'pending'}
                        </Badge>
                        {quote.quote_type === 'targeted' && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            Targeted
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(quote.event_date)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {quote.guest_count || 0} guests
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {quote.location || 'Location TBD'}
                        </div>
                      </div>

                      {quote.services && quote.services.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {quote.services.slice(0, 3).map((service: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {quote.services.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{quote.services.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {quote.vendor_count > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          Sent to {quote.vendor_count} selected vendors
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {getUrgencyIcon(quote.urgency)}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewQuote(quote)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quote Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedQuote && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedQuote.event_name || `${selectedQuote.event_type} Event`}
                </DialogTitle>
                <DialogDescription>Quote request details and status</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(selectedQuote.status)}>
                    {selectedQuote.status?.replace('_', ' ') || 'pending'}
                  </Badge>
                  {selectedQuote.quote_type === 'targeted' && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Targeted Quote
                    </Badge>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {selectedQuote.urgency} Priority
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Type:</strong> {selectedQuote.event_type}</div>
                        <div><strong>Date:</strong> {formatDate(selectedQuote.event_date)}</div>
                        <div><strong>Location:</strong> {selectedQuote.location || 'TBD'}</div>
                        <div><strong>Guests:</strong> {selectedQuote.guest_count || 0}</div>
                        <div><strong>Budget:</strong> {selectedQuote.budget_range || 'Not specified'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {selectedQuote.client_name}</div>
                        <div><strong>Email:</strong> {selectedQuote.client_email}</div>
                        {selectedQuote.client_phone && (
                          <div><strong>Phone:</strong> {selectedQuote.client_phone}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedQuote.services && selectedQuote.services.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Required Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedQuote.services.map((service: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedQuote.selected_vendors && selectedQuote.selected_vendors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Selected Vendors ({selectedQuote.selected_vendors.length})</h4>
                    <div className="space-y-2">
                      {selectedQuote.selected_vendors.map((vendor: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium">{vendor.name}</span>
                          <Badge variant="outline">{vendor.category}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedQuote.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {selectedQuote.description}
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  <div>Created: {formatDate(selectedQuote.created_at || selectedQuote.createdAt)}</div>
                  {selectedQuote.estimated_response_time && (
                    <div>Expected response: {selectedQuote.estimated_response_time}</div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}