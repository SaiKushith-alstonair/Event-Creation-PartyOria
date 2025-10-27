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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden conference-form-page">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-float"
            style={{
              width: `${20 + i * 10}px`,
              height: `${20 + i * 10}px`,
              left: `${10 + i * 12}%`,
              top: `${15 + i * 10}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 text-gray-700 hover:text-purple-600 hover:bg-white/90 transition-all duration-300 shadow-lg"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>
            )}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Events
            </h1>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 p-4 shadow-lg">
            <div className="text-sm text-gray-600">{filteredAndSortedEvents.length} events</div>
            <div className="text-xs text-gray-500">
              Total Budget: ₹{filteredAndSortedEvents.reduce((sum, event) => sum + (event.budget || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-white/30 p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">{filteredAndSortedEvents.length}</div>
            <div className="text-xs text-gray-600 font-medium">Total Events</div>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-white/30 p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {filteredAndSortedEvents.reduce((sum, event) => sum + (event.attendees || 0), 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 font-medium">Total Guests</div>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-white/30 p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              ₹{(filteredAndSortedEvents.reduce((sum, event) => sum + (event.budget || 0), 0) / 100000).toFixed(1)}L
            </div>
            <div className="text-xs text-gray-600 font-medium">Total Budget</div>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-white/30 p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
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
            <div className="text-xs text-gray-600 font-medium">Total Vendors</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-white/30 p-4 space-y-3 shadow-lg">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
          {filteredAndSortedEvents.map((event, index) => {
            const eventType = event.eventName.toLowerCase().includes('wedding') ? 'social' :
                            event.eventName.toLowerCase().includes('conference') ? 'corporate' :
                            event.eventName.toLowerCase().includes('festival') ? 'festival' :
                            event.eventName.toLowerCase().includes('sports') ? 'sports' :
                            event.eventName.toLowerCase().includes('cultural') ? 'cultural' :
                            'corporate';
            
            // Skin color combinations
            const skinColors = [
              'from-amber-100 via-orange-50 to-yellow-50',
              'from-rose-100 via-pink-50 to-orange-50', 
              'from-orange-100 via-amber-50 to-yellow-50',
              'from-yellow-100 via-orange-50 to-amber-50',
              'from-pink-100 via-rose-50 to-orange-50',
              'from-amber-50 via-yellow-50 to-orange-50'
            ];
            const skinColor = skinColors[index % skinColors.length];
            
            return (
              <div 
                key={event.id}
                className={`bg-gradient-to-br ${skinColor} backdrop-blur-sm rounded-xl border border-amber-200/40 hover:border-orange-300/60 shadow-sm hover:shadow-md transition-all duration-300 group transform hover:scale-105 relative overflow-hidden`}
              >
                {/* Event Image Placeholder */}
                <div className="h-16 bg-gradient-to-br from-amber-200 via-orange-200 to-yellow-200 relative overflow-hidden rounded-t-xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-lg opacity-60">
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
                    className="absolute top-1 right-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                  >
                    <Heart 
                      size={10} 
                      className={favorites.has(event.id) ? 'text-red-500 fill-current' : 'text-gray-400'}
                    />
                  </button>

                  {/* Status Badge */}
                  <div className="absolute top-1 left-1">
                    <span className={`px-1 py-0.5 text-xs rounded-full font-medium ${
                      event.status === 'completed' 
                        ? 'bg-emerald-100/90 text-emerald-700' 
                        : 'bg-amber-100/90 text-amber-700'
                    }`}>
                      {event.status === 'completed' ? '✓' : '•'}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-2 space-y-1.5">
                  {/* Event Name and Price */}
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-gray-800 group-hover:text-orange-700 transition-colors line-clamp-1">
                      {event.eventName}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-orange-600">
                        ₹{(event.budget || 0) > 100000 ? `${((event.budget || 0) / 100000).toFixed(1)}L` : (event.budget || 0).toLocaleString()}
                      </p>
                      {(() => {
                        const apiEvent = apiEvents.find(e => e.id?.toString() === event.id);
                        const subType = apiEvent?.form_data?.sub_type || 'event';
                        return (
                          <span className="px-1 py-0.5 text-xs bg-orange-100/80 text-orange-700 rounded-md font-medium">
                            {subType.split('-')[0].charAt(0).toUpperCase() + subType.split('-')[0].slice(1)}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="bg-white/60 rounded-md p-1.5 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Client:</span>
                      <span className="text-xs text-gray-800 font-medium truncate max-w-12">{event.clientName}</span>
                    </div>
                  </div>

                  {/* Event Details Grid */}
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users size={8} className="text-orange-500" />
                      <span>{event.attendees || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                      <span>{(() => {
                        const apiEvent = apiEvents.find(e => e.id?.toString() === event.id);
                        const selectedServices = apiEvent?.selected_services;
                        const vendorServices = apiEvent?.form_data?.selectedVendorServices;
                        const serviceCount = selectedServices?.length || vendorServices?.length || 0;
                        return serviceCount;
                      })()}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-gray-600">
                    <p className="flex items-center gap-1">
                      <Calendar size={8} className="text-amber-500" />
                      <span className="truncate">{event.dateTime ? new Date(event.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}</span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const apiEvent = apiEvents.find(e => e.id?.toString() === event.id);
                        const eventType = apiEvent?.form_data?.event_type || 'corporate';
                        const subType = apiEvent?.form_data?.sub_type || 'conference';
                        onEditEvent(event.id, eventType, subType);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-1.5 py-1 text-xs font-semibold bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-md hover:from-orange-500 hover:to-amber-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Edit size={8} />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEventId(event.id);
                        setShowDetailsModal(true);
                      }}
                      className="flex items-center justify-center px-1.5 py-1 text-xs font-semibold bg-white/80 text-gray-700 rounded-md border border-amber-200 hover:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Eye size={8} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event.id, (event as any).isApiEvent);
                      }}
                      className="flex items-center justify-center px-1.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50/80 rounded-md border border-red-200/60 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Trash2 size={8} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          25% { transform: translateY(-20px) rotate(90deg); opacity: 1; }
          50% { transform: translateY(-10px) rotate(180deg); opacity: 0.8; }
          75% { transform: translateY(-15px) rotate(270deg); opacity: 0.9; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      
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