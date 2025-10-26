import React from 'react';
import { Calendar, Edit, Trash2, Clock, Eye, Search, Filter, ChevronDown, Heart, Users, MapPin, ArrowLeft } from 'lucide-react';
import { eventStorage, StoredEvent } from '../utils/localStorage';
import { apiService, ApiEvent } from '../services/api';
import EventDetailsModal from './EventDetailsModal';
import { getEventTheme } from '../utils/eventThemes';

interface EventListProps {
  onEditEvent: (eventId: string, sectionId: string, subsectionId: string) => void;
  onBack?: () => void;
}

const EventList: React.FC<EventListProps> = ({ onEditEvent, onBack }) => {
  const [events, setEvents] = React.useState<StoredEvent[]>([]);
  const [apiEvents, setApiEvents] = React.useState<ApiEvent[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [priceFilter, setPriceFilter] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState('');
  const [guestFilter, setGuestFilter] = React.useState('');
  const [sortBy, setSortBy] = React.useState('date');
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const [localEvents, backendEvents] = await Promise.all([
          eventStorage.getAllEvents(),
          apiService.getEvents()
        ]);
        setEvents(localEvents);
        setApiEvents(backendEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents(eventStorage.getAllEvents());
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const handleDelete = async (eventId: string, isApiEvent = false) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        if (isApiEvent) {
          await apiService.deleteEvent(parseInt(eventId));
          setApiEvents(prev => prev.filter(e => e.id !== parseInt(eventId)));
        } else {
          eventStorage.deleteEvent(eventId);
          setEvents(eventStorage.getAllEvents());
        }
        alert('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        // Handle 404 (already deleted) as success
        if (error instanceof Error && (error.message.includes('404') || error.message.includes('204'))) {
          if (isApiEvent) {
            setApiEvents(prev => prev.filter(e => e.id !== parseInt(eventId)));
          }
          alert('Event deleted successfully!');
        } else {
          alert('Error deleting event. Please try again.');
        }
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const allEvents = [...events, ...apiEvents.map(e => ({
    id: e.id!.toString(),
    eventName: e.event_name,
    clientName: e.form_data?.clientName || '',
    clientEmail: e.form_data?.clientEmail || '',
    clientPhone: e.form_data?.clientPhone || '',
    dateTime: e.form_data?.dateTime || '',
    state: e.form_data?.state || '',
    city: e.form_data?.city || '',
    venueDetails: e.form_data?.venueDetails || '',
    traditionStyle: e.form_data?.traditionStyle || '',
    venue: `${e.form_data?.city || ''}, ${e.form_data?.state || ''}`.replace(', ', ''),
    attendees: e.form_data?.attendees || 0,
    budget: e.form_data?.budget || 0,
    description: e.form_data?.description || '',
    selectedVendors: [],
    customRequirements: e.form_data?.customRequirements || '',
    specialInstructions: e.form_data?.specialInstructions || '',
    accessibilityNeeds: e.form_data?.accessibilityNeeds || '',
    needsVendor: false,
    eventPriority: e.form_data?.eventPriority || 'medium',
    contactPreference: e.form_data?.contactPreference || 'both',
    timeline: e.form_data?.timeline || [],
    foodPreferences: e.form_data?.foodPreferences || [],
    specialRequirements: e.special_requirements || {},
    status: 'completed' as const,
    createdAt: e.created_at || new Date().toISOString(),
    updatedAt: e.updated_at || new Date().toISOString(),
    isApiEvent: true
  }))];

  const toggleFavorite = (eventId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
      } else {
        newFavorites.add(eventId);
      }
      return newFavorites;
    });
  };

  const filteredAndSortedEvents = React.useMemo(() => {
    let filtered = allEvents.filter(event => {
      const matchesSearch = event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPrice = !priceFilter || (
        priceFilter === 'low' && event.budget < 50000 ||
        priceFilter === 'medium' && event.budget >= 50000 && event.budget < 200000 ||
        priceFilter === 'high' && event.budget >= 200000
      );
      
      const matchesGuests = !guestFilter || (
        guestFilter === 'small' && event.attendees < 50 ||
        guestFilter === 'medium' && event.attendees >= 50 && event.attendees < 200 ||
        guestFilter === 'large' && event.attendees >= 200
      );
      
      return matchesSearch && matchesPrice && matchesGuests;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dateTime || 0).getTime() - new Date(a.dateTime || 0).getTime();
        case 'name':
          return a.eventName.localeCompare(b.eventName);
        case 'budget':
          return b.budget - a.budget;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allEvents, searchQuery, priceFilter, dateFilter, guestFilter, sortBy]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading events...</p>
      </div>
    );
  }

  if (allEvents.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>
            )}
          </div>
        </div>
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">{filteredAndSortedEvents.length} events</div>
            <div className="text-xs text-gray-400">
              Total Budget: ₹{filteredAndSortedEvents.reduce((sum, event) => sum + (event.budget || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{filteredAndSortedEvents.length}</div>
          <div className="text-sm text-purple-600">Total Events</div>
        </div>
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">
            {filteredAndSortedEvents.reduce((sum, event) => sum + (event.attendees || 0), 0).toLocaleString()}
          </div>
          <div className="text-sm text-blue-600">Total Guests</div>
        </div>
        <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">
            ₹{(filteredAndSortedEvents.reduce((sum, event) => sum + (event.budget || 0), 0) / 100000).toFixed(1)}L
          </div>
          <div className="text-sm text-green-600">Total Budget</div>
        </div>
        <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">
            {(() => {
              const totalVendors = filteredAndSortedEvents.reduce((sum, event) => {
                const apiEvent = apiEvents.find(e => e.id?.toString() === event.id);
                const selectedServices = apiEvent?.selected_services;
                const vendorServices = apiEvent?.form_data?.selectedVendorServices;
                return sum + (selectedServices?.length || vendorServices?.length || 0);
              }, 0);
              return totalVendors;
            })()}
          </div>
          <div className="text-sm text-orange-600">Total Vendors</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-300 p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search events or clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Budgets</option>
            <option value="low">Under ₹50K</option>
            <option value="medium">₹50K - ₹2L</option>
            <option value="high">Above ₹2L</option>
          </select>

          <select
            value={guestFilter}
            onChange={(e) => setGuestFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Guest Counts</option>
            <option value="small">Under 50</option>
            <option value="medium">50 - 200</option>
            <option value="large">200+</option>
          </select>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="budget">Budget</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedEvents.map((event, index) => {
          const eventType = event.eventName.toLowerCase().includes('wedding') ? 'social' :
                          event.eventName.toLowerCase().includes('conference') ? 'corporate' :
                          event.eventName.toLowerCase().includes('festival') ? 'festival' :
                          event.eventName.toLowerCase().includes('sports') ? 'sports' :
                          event.eventName.toLowerCase().includes('cultural') ? 'cultural' :
                          'corporate';
          
          return (
            <div 
              key={event.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-300 hover:border-purple-400 hover:shadow-xl transition-all duration-200 group interactive-card"
            >
              {/* Event Image Placeholder */}
              <div className="h-40 bg-gradient-to-br from-purple-200 to-pink-300 relative overflow-hidden rounded-t-xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl opacity-50">
                    {eventType === 'social' ? '💍' : 
                     eventType === 'corporate' ? '💼' :
                     eventType === 'festival' ? '🎊' :
                     eventType === 'sports' ? '⚽' :
                     eventType === 'cultural' ? '🎭' : '📅'}
                  </div>
                </div>
                
                {/* Heart Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(event.id);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                >
                  <Heart 
                    size={16} 
                    className={favorites.has(event.id) ? 'text-red-500 fill-current' : 'text-gray-400'}
                  />
                </button>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    event.status === 'completed' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {event.status === 'completed' ? 'Completed' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                {/* Event Name and Price */}
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {event.eventName}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{event.budget?.toLocaleString() || '0'}
                    </p>
                    {(() => {
                      const apiEvent = apiEvents.find(e => e.id?.toString() === event.id);
                      const eventType = apiEvent?.form_data?.event_type || 'general';
                      const subType = apiEvent?.form_data?.sub_type || 'event';
                      return (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                          {subType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Client Information */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Client:</span>
                    <span className="text-sm text-gray-900 font-medium">{event.clientName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Contact:</span>
                    <span className="text-sm text-gray-600">{event.clientPhone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <span className="text-sm text-gray-600 truncate max-w-32">{event.clientEmail}</span>
                  </div>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={14} className="text-purple-500" />
                    <span>{event.attendees || 0} guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={14} className="text-green-500" />
                    <span>{(() => {
                      const apiEvent = apiEvents.find(e => e.id?.toString() === event.id);
                      const duration = apiEvent?.form_data?.duration || apiEvent?.duration;
                      return duration ? duration.replace('-', ' ') : 'TBD';
                    })()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
                    <span>{(() => {
                      const apiEvent = apiEvents.find(e => e.id?.toString() === event.id);
                      const selectedServices = apiEvent?.selected_services;
                      const vendorServices = apiEvent?.form_data?.selectedVendorServices;
                      const serviceCount = selectedServices?.length || vendorServices?.length || 0;
                      return `${serviceCount} vendors`;
                    })()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className={`w-3 h-3 rounded-full ${
                      event.eventPriority === 'high' ? 'bg-red-400' :
                      event.eventPriority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></span>
                    <span className="capitalize">{event.eventPriority || 'medium'} priority</span>
                  </div>
                </div>

                {/* Location and Date */}
                <div className="space-y-2 text-sm text-gray-600">
                  {(event as any).venue && (
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-blue-500" />
                      <span>{(event as any).venue}</span>
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Calendar size={14} className="text-orange-500" />
                    <span>{event.dateTime ? formatDate(event.dateTime) : 'Date TBD'}</span>
                  </p>
                </div>

                {/* Special Features */}
                {(() => {
                  const apiEvent = apiEvents.find(e => e.id?.toString() === event.id);
                  const features = [];
                  
                  if (apiEvent?.form_data?.traditionStyle) features.push(apiEvent.form_data.traditionStyle);
                  if (apiEvent?.form_data?.foodPreferences?.length) features.push(`${apiEvent.form_data.foodPreferences.length} food prefs`);
                  if (apiEvent?.special_requirements && Object.keys(apiEvent.special_requirements).length > 0) {
                    const reqCount = Object.values(apiEvent.special_requirements).filter(req => 
                      typeof req === 'object' && req !== null && (req as any).selected
                    ).length;
                    if (reqCount > 0) features.push(`${reqCount} special reqs`);
                  }
                  
                  return features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {feature}
                        </span>
                      ))}
                      {features.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{features.length - 3} more
                        </span>
                      )}
                    </div>
                  );
                })()}

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded">
                  {event.description || 'Professional event planning with expert coordination and seamless execution.'}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const apiEvent = apiEvents.find(e => e.id?.toString() === event.id);
                      const eventType = apiEvent?.form_data?.event_type || 'corporate';
                      const subType = apiEvent?.form_data?.sub_type || 'conference';
                      onEditEvent(event.id, eventType, subType);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEventId(event.id);
                      setShowDetailsModal(true);
                    }}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye size={14} />
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(event.id, (event as any).isApiEvent);
                    }}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <EventDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onEdit={() => {
          setShowDetailsModal(false);
          if (selectedEventId) {
            // Get the actual event type and subsection from the event data
            const apiEvent = apiEvents.find(e => e.id?.toString() === selectedEventId);
            const eventType = apiEvent?.form_data?.event_type || 'corporate';
            const subType = apiEvent?.form_data?.sub_type || 'conference';
            onEditEvent(selectedEventId, eventType, subType);
          }
        }}
        eventId={selectedEventId || ''}
      />
    </div>
  );
};

export default EventList;