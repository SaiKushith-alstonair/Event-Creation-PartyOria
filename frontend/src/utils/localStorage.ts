import { EventFormData } from '../types';

const STORAGE_KEY = 'partyoria_events';
const DRAFT_KEY = 'partyoria_draft';

export interface StoredEvent extends EventFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'completed';
}

export const eventStorage = {
  // Save event (draft or completed)
  saveEvent: (eventData: EventFormData, status: 'draft' | 'completed' = 'draft'): string => {
    const events = eventStorage.getAllEvents();
    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    const storedEvent: StoredEvent = {
      ...eventData,
      id,
      createdAt: now,
      updatedAt: now,
      status
    };
    
    events.push(storedEvent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return id;
  },

  // Update existing event
  updateEvent: (id: string, eventData: EventFormData, status?: 'draft' | 'completed'): void => {
    const events = eventStorage.getAllEvents();
    const index = events.findIndex(e => e.id === id);
    
    if (index !== -1) {
      events[index] = {
        ...events[index],
        ...eventData,
        updatedAt: new Date().toISOString(),
        ...(status && { status })
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  },

  // Get all events
  getAllEvents: (): StoredEvent[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Get event by ID
  getEvent: (id: string): StoredEvent | null => {
    const events = eventStorage.getAllEvents();
    return events.find(e => e.id === id) || null;
  },

  // Delete event
  deleteEvent: (id: string): void => {
    const events = eventStorage.getAllEvents();
    const filtered = events.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Save current draft
  saveDraft: (eventData: EventFormData): void => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      ...eventData,
      savedAt: new Date().toISOString()
    }));
  },

  // Get current draft
  getDraft: (): (EventFormData & { savedAt: string }) | null => {
    const stored = localStorage.getItem(DRAFT_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Clear draft
  clearDraft: (): void => {
    localStorage.removeItem(DRAFT_KEY);
  }
};