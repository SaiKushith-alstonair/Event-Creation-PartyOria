const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface ApiEvent {
  id?: number;
  event_name: string;
  form_data: any;
  special_requirements?: Record<string, { selected: boolean; quantity?: number; unit?: string; }>;
  selected_services?: string[];
  budget_allocation?: Record<string, { amount: number; percentage: number; services: string[]; }>;
  allocation_method?: 'manual' | 'automatic';
  created_at?: string;
  updated_at?: string;
  budget_min?: number;
  budget_max?: number;
  budget_range?: string;
  duration?: string;
  custom_duration?: string;
  event_priority?: string;
  tradition_style?: string;
  contact_preference?: string;
  custom_requirements?: string;
  special_instructions?: string;
  accessibility_needs?: string;
  vendor_selection_completed?: boolean;
  food_preferences?: string[];
  timeline?: any[];
}

export interface ApiEventSection {
  section_id: string;
  name: string;
  icon: string;
  subsections: ApiEventSubsection[];
}

export interface ApiEventSubsection {
  subsection_id: string;
  name: string;
}

export interface ApiEventImage {
  event_id: string;
  image_url: string;
  description: string;
}

export interface ApiEventRequirement {
  event_id: string;
  category_name: string;
  requirement_id: string;
  label: string;
  category: string;
  unit?: string;
  placeholder?: string;
}

export interface ApiVendorCategory {
  category_id: string;
  name: string;
  vendors: any[];
}

export interface ApiLocation {
  id: number;
  state: string;
  city: string;
}

export interface ApiTraditionStyle {
  id: number;
  event_type?: string;
  style_name: string;
  description: string;
}

export interface ApiVendor {
  id: number;
  name: string;
  category: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  website?: string;
  location: string;
  price_range_min: number;
  price_range_max: number;
  rating: number;
  is_available: boolean;
}

export interface ApiVendorBooking {
  id?: number;
  vendor_id: number;
  event_id: number;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      // Enhanced error logging with context
      const errorContext = {
        endpoint,
        method: options.method || 'GET',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      // Minimal logging
      
      // Re-throw with enhanced context
      throw new Error(`API request to ${endpoint} failed: ${error.message}`);
    }
  }

  // Events API
  async getEvents(): Promise<ApiEvent[]> {
    return this.request<ApiEvent[]>('/events/');
  }

  async createEvent(event: Omit<ApiEvent, 'id'>): Promise<ApiEvent> {
    console.log('Creating event with data:', event);
    return this.request<ApiEvent>('/events/', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async getEvent(id: number): Promise<ApiEvent> {
    return this.request<ApiEvent>(`/events/${id}/`);
  }

  async updateEvent(id: number, event: Partial<ApiEvent>): Promise<ApiEvent> {
    return this.request<ApiEvent>(`/events/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  }

  async deleteEvent(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok && response.status !== 204) {
      throw new Error(`API Error: ${response.status}`);
    }
  }

  async searchEvents(query: string, eventType?: string): Promise<ApiEvent[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (eventType) params.append('type', eventType);
    
    return this.request<ApiEvent[]>(`/events/search/?${params}`);
  }

  async getEventTypes(): Promise<{value: string, label: string}[]> {
    return this.request<{value: string, label: string}[]>('/events/event_types/');
  }

  async getBudgetRanges(): Promise<{value: string, label: string}[]> {
    return this.request<{value: string, label: string}[]>('/events/budget_ranges/');
  }

  // Locations API
  async getStates(): Promise<{name: string}[]> {
    const response = await this.request<{states: {name: string}[]}>('/events/states/');
    return response.states;
  }

  async getCities(state: string): Promise<{name: string}[]> {
    const response = await this.request<{cities: {name: string}[]}>(`/events/cities/?state=${encodeURIComponent(state)}`);
    return response.cities;
  }

  // Traditions API with fallback
  async getTraditionStyles(eventType: string): Promise<ApiTraditionStyle[]> {
    try {
      console.log('API: Requesting traditions for event type:', eventType);
      const result = await this.request<ApiTraditionStyle[]>(`/events/traditions/by_event_type/?event_type=${encodeURIComponent(eventType)}`);
      console.log('API: Traditions response:', result);
      return result;
    } catch (error) {
      console.log('API: Traditions request failed:', error);
      throw new Error(`Traditions API endpoint not available: ${error}`);
    }
  }

  // Event System API
  async getEventSections(): Promise<ApiEventSection[]> {
    return this.request<ApiEventSection[]>('/events/sections/');
  }

  async getEventImages(): Promise<ApiEventImage[]> {
    return this.request<ApiEventImage[]>('/events/images/');
  }

  async getEventRequirements(eventId: string): Promise<ApiEventRequirement[]> {
    return this.request<ApiEventRequirement[]>(`/events/requirements/?event_id=${encodeURIComponent(eventId)}`);
  }

  async getVendorCategories(): Promise<ApiVendorCategory[]> {
    return this.request<ApiVendorCategory[]>('/events/vendor-categories/');
  }

  // Vendors API (using fallback data)
  async getVendors(): Promise<ApiVendor[]> {
    return [];
  }

  async searchVendors(query?: string, category?: string): Promise<ApiVendor[]> {
    return [];
  }

  async createVendorBooking(booking: Omit<ApiVendorBooking, 'id'>): Promise<ApiVendorBooking> {
    return { id: 1, ...booking };
  }
}

// Helper function to convert EventFormData to ApiEvent
export const convertFormDataToApiEvent = (formData: any, eventType: string, subType: string): any => {
  // Convert special requirements to proper format with quantity support
  const convertedSpecialRequirements: Record<string, { selected: boolean; quantity?: number; unit?: string; }> = {};
  
  if (formData.specialRequirements) {
    Object.entries(formData.specialRequirements).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'object' && value !== null) {
        convertedSpecialRequirements[key] = {
          selected: value.selected || true,
          ...(value.quantity !== undefined && { quantity: parseInt(value.quantity) || 0 }),
          ...(value.unit && { unit: value.unit })
        };
      } else if (typeof value === 'string' && value.trim()) {
        // Handle simple string values as quantity
        const quantity = parseInt(value);
        if (!isNaN(quantity)) {
          convertedSpecialRequirements[key] = {
            selected: true,
            quantity: quantity
          };
        }
      }
    });
  }

  return {
    event_name: formData.eventName || 'Untitled Event',
    special_requirements: convertedSpecialRequirements,
    selected_services: formData.selectedServices || [],
    budget_allocation: formData.budgetAllocation?.categories || {},
    allocation_method: formData.budgetAllocation?.method || null,

    form_data: {
      event_type: eventType,
      sub_type: subType,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      dateTime: formData.dateTime,
      duration: formData.duration,
      customDuration: formData.customDuration,
      state: formData.state,
      city: formData.city,
      venueDetails: formData.venueDetails,
      traditionStyle: formData.traditionStyle,
      attendees: formData.attendees,
      budget: formData.budget,
      description: formData.description,
      timeline: formData.timeline || [],
      foodPreferences: formData.foodPreferences || [],
      selectedServices: formData.selectedServices || [],
      selectedVenueTypes: formData.selectedVenueTypes || [],
      selectedVendorServices: formData.selectedVendorServices || [],
      planningType: formData.planningType,
      customRequirements: formData.customRequirements,
      specialInstructions: formData.specialInstructions,
      accessibilityNeeds: formData.accessibilityNeeds,
      eventPriority: formData.eventPriority,
      contactPreference: formData.contactPreference
    }
  };
};

// Helper function to convert ApiEvent to EventFormData
export const convertApiEventToFormData = (apiEvent: ApiEvent): any => {
  return {
    eventName: apiEvent.event_name,
    specialRequirements: apiEvent.special_requirements || {},
    budgetAllocation: apiEvent.budget_allocation ? {
      categories: apiEvent.budget_allocation,
      method: apiEvent.allocation_method || 'manual',
      totalAllocated: Object.values(apiEvent.budget_allocation).reduce((sum, cat) => sum + cat.amount, 0)
    } : null,
    timeline: apiEvent.form_data?.timeline || [],
    foodPreferences: apiEvent.form_data?.foodPreferences || [],
    selectedServices: apiEvent.form_data?.selectedServices || [],
    selectedVenueTypes: apiEvent.form_data?.selectedVenueTypes || [],
    selectedVendorServices: apiEvent.form_data?.selectedVendorServices || [],
    planningType: apiEvent.form_data?.planningType,

    ...apiEvent.form_data
  };
};

export const apiService = new ApiService();