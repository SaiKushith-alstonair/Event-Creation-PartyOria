export interface EventSection {
  id: string;
  name: string;
  icon: string;
  subsections: EventSubsection[];
}

export interface EventSubsection {
  id: string;
  name: string;
  vendors: Vendor[];
  description?: string;
  typeTheme?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

export interface TimelineEvent {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
}

export interface EventFormData {
  eventName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  dateTime: string;
  duration?: string;
  customDuration?: string;
  state: string;
  city: string;
  venueDetails: string;
  traditionStyle: string;
  attendees: number;
  budget: number;
  description: string;
  selectedVendors: string[];
  customRequirements: string;
  specialInstructions: string;
  accessibilityNeeds: string;
  needsVendor: boolean;
  eventPriority?: 'low' | 'medium' | 'high';
  contactPreference?: 'email' | 'phone' | 'both';
  
  // Event Images
  inspirationImage?: File | null;
  
  // Timeline/Schedule (Dynamic)
  timeline: TimelineEvent[];
  
  // Food Preferences
  foodPreferences: string[];
  
  // Special Requirements (Dynamic per event type with quantities)
  specialRequirements: Record<string, any>;
  
  // Venue and Vendor Selection for Skip Flow
  selectedVenueTypes?: string[];
  selectedVendorServices?: string[];
  selectedServices?: string[];
  
  // Planning Type Tracking
  planningType?: 'detailed' | 'skip';
  
  // Budget Allocation (Phase 1)
  budgetAllocation?: {
    categories: Record<string, {
      amount: number;
      percentage: number;
      services: string[];
    }>;
    totalAllocated: number;
    method: 'manual' | 'automatic';
  };
}

export interface NavigationState {
  selectedSection: string | null;
  selectedSubsection: string | null;
  currentPage: 'selection' | 'event-creation' | 'event-list';
}

export interface FestivalSubtype {
  id: string;
  name: string;
  additionalVendors?: Vendor[];
}

export interface ValidationErrors {
  [key: string]: string | undefined;
  eventName?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  dateTime?: string;
  duration?: string;
  venue?: string;
  attendees?: string;
  budget?: string;
  description?: string;
  selectedVendors?: string;
  customRequirements?: string;
  specialInstructions?: string;
  accessibilityNeeds?: string;
}