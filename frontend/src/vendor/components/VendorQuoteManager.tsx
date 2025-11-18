import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Clock, Users, Calendar, MapPin, IndianRupee, 
  Send, AlertCircle, CheckCircle, Eye, Plus, Minus 
} from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const VendorQuoteManager: React.FC = () => {
  const { toast } = useToast();
  const [pendingQuotes, setPendingQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    quote_amount: '',
    message: '',
    includes: [''],
    excludes: ['']
  });

  useEffect(() => {
    loadPendingQuotes();
  }, []);

  const loadPendingQuotes = async () => {
    try {
      setLoading(true);
      const response = await apiService.getVendorPendingQuotes();
      if (response.success) {
        setPendingQuotes(response.pending_quotes);
      }
    } catch (error) {
      console.error('Error loading pending quotes:', error);
      toast({
        title: "Error",
        description: "Failed to load pending quotes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuote = async () => {
    if (!selectedQuote || !quoteForm.quote_amount) {
      toast({
        title: "Error",
        description: "Please enter a valid quote amount",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiService.submitVendorQuote(selectedQuote.id, {
        quote_amount: parseFloat(quoteForm.quote_amount),
        message: quoteForm.message,
        includes: quoteForm.includes.filter(item => item.trim()),
        excludes: quoteForm.excludes.filter(item => item.trim())
      });

      if (response.success) {
        toast({
          title: "Quote Submitted!",
          description: "Your quote has been sent to the customer.",
        });
        
        setIsQuoteModalOpen(false);
        setQuoteForm({
          quote_amount: '',
          message: '',
          includes: [''],
          excludes: ['']
        });
        
        // Refresh pending quotes
        await loadPendingQuotes();
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Error",
        description: "Failed to submit quote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openQuoteModal = (quote: any) => {
    setSelectedQuote(quote);
    setQuoteForm({
      quote_amount: '',
      message: `Thank you for considering our services for your ${quote.event_type}. We would be delighted to provide our professional services for your event.`,
      includes: ['Professional service', 'Quality guarantee'],
      excludes: ['Transportation costs', 'Additional equipment']
    });
    setIsQuoteModalOpen(true);
  };

  const addIncludeItem = () => {
    setQuoteForm(prev => ({
      ...prev,
      includes: [...prev.includes, '']
    }));
  };

  const removeIncludeItem = (index: number) => {
    setQuoteForm(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const updateIncludeItem = (index: number, value: string) => {
    setQuoteForm(prev => ({
      ...prev,
      includes: prev.includes.map((item, i) => i === index ? value : item)
    }));
  };

  const addExcludeItem = () => {
    setQuoteForm(prev => ({
      ...prev,
      excludes: [...prev.excludes, '']
    }));
  };

  const removeExcludeItem = (index: number) => {
    setQuoteForm(prev => ({
      ...prev,
      excludes: prev.excludes.filter((_, i) => i !== index)
    }));
  };

  const updateExcludeItem = (index: number, value: string) => {
    setQuoteForm(prev => ({
      ...prev,
      excludes: prev.excludes.map((item, i) => i === index ? value : item)
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">Loading quote requests...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
          <p className="text-gray-600">Manage incoming quote requests from customers</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {pendingQuotes.length} pending
        </Badge>
      </div>

      {pendingQuotes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Quotes</h3>
            <p className="text-gray-600">
              You don't have any pending quote requests at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingQuotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {quote.event_name}
                      </h3>
                      <Badge className={getUrgencyColor(quote.urgency)}>
                        {quote.urgency} priority
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(quote.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{quote.guest_count} guests</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{quote.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IndianRupee className="h-4 w-4" />
                        <span>{quote.budget_range}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-700 font-medium mb-1">Client: {quote.client_name}</p>
                      <p className="text-sm text-gray-600">Event Type: {quote.event_type}</p>
                    </div>

                    {quote.services && quote.services.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Required Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {quote.services.map((service: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {quote.description && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded mb-3">
                        {quote.description}
                      </p>
                    )}

                    <div className="text-xs text-gray-500">
                      Received: {formatDate(quote.created_at)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openQuoteModal(quote)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Submit Quote
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quote Submission Modal */}
      <Dialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedQuote && (
            <>
              <DialogHeader>
                <DialogTitle>Submit Quote for {selectedQuote.event_name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Event Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Client:</strong> {selectedQuote.client_name}</div>
                    <div><strong>Date:</strong> {formatDate(selectedQuote.event_date)}</div>
                    <div><strong>Guests:</strong> {selectedQuote.guest_count}</div>
                    <div><strong>Budget:</strong> {selectedQuote.budget_range}</div>
                  </div>
                </div>

                {/* Quote Amount */}
                <div>
                  <Label htmlFor="quote_amount">Quote Amount (₹) *</Label>
                  <Input
                    id="quote_amount"
                    type="number"
                    placeholder="Enter your quote amount"
                    value={quoteForm.quote_amount}
                    onChange={(e) => setQuoteForm(prev => ({ ...prev, quote_amount: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message">Message to Customer</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a personal message..."
                    value={quoteForm.message}
                    onChange={(e) => setQuoteForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* What's Included */}
                <div>
                  <Label>What's Included</Label>
                  <div className="space-y-2 mt-1">
                    {quoteForm.includes.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="What's included in your service..."
                          value={item}
                          onChange={(e) => updateIncludeItem(index, e.target.value)}
                        />
                        {quoteForm.includes.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeIncludeItem(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addIncludeItem}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                </div>

                {/* What's Not Included */}
                <div>
                  <Label>What's Not Included (Optional)</Label>
                  <div className="space-y-2 mt-1">
                    {quoteForm.excludes.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="What's not included..."
                          value={item}
                          onChange={(e) => updateExcludeItem(index, e.target.value)}
                        />
                        {quoteForm.excludes.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeExcludeItem(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addExcludeItem}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsQuoteModalOpen(false)}
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorQuoteManager;