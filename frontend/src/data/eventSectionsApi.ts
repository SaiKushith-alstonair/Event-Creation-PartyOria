import { apiService } from '../services/api';
import { eventSections } from './eventSections';

// Type definitions for better type safety
interface CachedData {
  sections?: any[];
  images?: Record<string, string>;
  requirements?: Record<string, any>;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
}

// Improved cache management with better type safety
const cache: CachedData = {
  sections: null,
  images: null,
  requirements: null
};

// Legacy variables for backward compatibility
let cachedSections: any[] | null = null;
let cachedImages: Record<string, string> | null = null;
let cachedRequirements: Record<string, any> | null = null;

// Helper function to handle API errors gracefully
const handleApiError = (error: any, context: string): ApiError => {
  const apiError = error as ApiError;
  apiError.context = context;
  // Only log in development mode to reduce console noise
  if (process.env.NODE_ENV === 'development') {
    console.info(`API fallback used for ${context}:`, error.message);
  }
  return apiError;
};

export const getEventSectionsFromApi = async () => {
  if (cachedSections) {
    return cachedSections;
  }

  try {
    const apiSections = await apiService.getEventSections();
    
    // Transform API data to match frontend format with validation
    if (!Array.isArray(apiSections)) {
      throw new Error('Invalid API response: expected array of sections');
    }
    
    cachedSections = apiSections.map(section => {
      if (!section.section_id || !section.name) {
        console.warn('Invalid section data:', section);
        return null;
      }
      
      return {
        id: section.section_id,
        name: section.name,
        icon: section.icon || '📅',
        subsections: (section.subsections || []).map(sub => ({
          id: sub.subsection_id || `${section.section_id}-${Date.now()}`,
          name: sub.name || 'Unnamed Event',
          vendors: [] // Will be populated from requirements
        }))
      };
    }).filter(Boolean);
    
    cache.sections = cachedSections;
    return cachedSections;
  } catch (error) {
    handleApiError(error, 'getEventSections');
    console.warn('Using fallback event sections data');
    cachedSections = eventSections;
    return eventSections;
  }
};

export const getEventImagesFromApi = async () => {
  if (cachedImages) {
    return cachedImages;
  }

  try {
    const apiImages = await apiService.getEventImages();
    
    if (!Array.isArray(apiImages)) {
      throw new Error('Invalid API response: expected array of images');
    }
    
    cachedImages = {};
    apiImages.forEach(img => {
      if (img.event_id && img.image_url) {
        cachedImages![img.event_id] = img.image_url;
      }
    });
    
    cache.images = cachedImages;
    return cachedImages;
  } catch (error) {
    handleApiError(error, 'getEventImages');
    console.warn('Using fallback event images');
    
    // Return comprehensive fallback images
    cachedImages = {
      'default': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
      'wedding': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
      'birthday': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop',
      'conference': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop'
    };
    
    return cachedImages;
  }
};

export const getEventRequirementsFromApi = async (eventId: string) => {
  if (cachedRequirements && cachedRequirements[eventId]) {
    return cachedRequirements[eventId];
  }

  try {
    const apiRequirements = await apiService.getEventRequirements(eventId);
    
    if (!Array.isArray(apiRequirements)) {
      throw new Error('Invalid API response: expected array of requirements');
    }
    
    // Group requirements by category with validation
    const groupedRequirements: Record<string, any[]> = {};
    apiRequirements.forEach(req => {
      if (!req.category_name || !req.requirement_id) {
        console.warn('Invalid requirement data:', req);
        return;
      }
      
      if (!groupedRequirements[req.category_name]) {
        groupedRequirements[req.category_name] = [];
      }
      
      groupedRequirements[req.category_name].push({
        id: req.requirement_id,
        label: req.label || 'Unnamed Requirement',
        category: req.category || 'other',
        unit: req.unit,
        placeholder: req.placeholder
      });
    });
    
    if (!cachedRequirements) {
      cachedRequirements = {};
    }
    cachedRequirements[eventId] = groupedRequirements;
    cache.requirements = cachedRequirements;
    
    return groupedRequirements;
  } catch (error) {
    handleApiError(error, 'getEventRequirements');
    console.warn(`Using fallback requirements for event ${eventId}`);
    
    // Return basic fallback requirements
    const fallbackRequirements = {
      'Essential Services': [
        { id: 'photography', label: 'Photography', category: 'photography' },
        { id: 'coordination', label: 'Event Coordination', category: 'coordination' }
      ]
    };
    
    if (!cachedRequirements) {
      cachedRequirements = {};
    }
    cachedRequirements[eventId] = fallbackRequirements;
    
    return fallbackRequirements;
  }
};

export const getDynamicRequirementsFromApi = async (eventType: string, subsectionId: string) => {
  const cacheKey = `${eventType}-${subsectionId}`;
  if (cachedRequirements && cachedRequirements[cacheKey]) {
    return cachedRequirements[cacheKey];
  }

  try {
    // Try to fetch from API first
    const response = await fetch(`http://127.0.0.1:8000/api/events/dynamic-requirements/?event_type=${eventType}&subsection_id=${subsectionId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const dynamicRequirements = await response.json();
    
    if (!cachedRequirements) {
      cachedRequirements = {};
    }
    cachedRequirements[cacheKey] = dynamicRequirements;
    
    return dynamicRequirements;
  } catch (error) {
    // Silently use fallback data when API is unavailable
    console.info(`Using local fallback data for ${eventType}/${subsectionId}`);
    
    // Import and use local fallback data with better error handling
    try {
      const { getRequirementsForEvent } = await import('./dynamicRequirements');
      const fallbackRequirements = getRequirementsForEvent(eventType, subsectionId);
      
      if (!fallbackRequirements || Object.keys(fallbackRequirements).length === 0) {
        console.warn('Fallback requirements are empty, using minimal default');
        const minimalRequirements = {
          'Essential Services': [
            { id: 'photography', label: 'Photography', category: 'photography' },
            { id: 'coordination', label: 'Event Coordination', category: 'coordination' }
          ]
        };
        
        if (!cachedRequirements) {
          cachedRequirements = {};
        }
        cachedRequirements[cacheKey] = minimalRequirements;
        return minimalRequirements;
      }
      
      // Cache the fallback data
      if (!cachedRequirements) {
        cachedRequirements = {};
      }
      cachedRequirements[cacheKey] = fallbackRequirements;
      cache.requirements = cachedRequirements;
      
      return fallbackRequirements;
    } catch (fallbackError) {
      console.warn('Fallback requirements failed:', fallbackError.message);
      
      // Return absolute minimal requirements as last resort
      const minimalRequirements = {
        'Basic Services': [
          { id: 'basic-coordination', label: 'Basic Coordination', category: 'coordination' }
        ]
      };
      
      return minimalRequirements;
    }
  }
};

// Utility functions for cache management
export const clearCache = () => {
  cachedSections = null;
  cachedImages = null;
  cachedRequirements = null;
  cache.sections = null;
  cache.images = null;
  cache.requirements = null;
  console.log('API cache cleared');
};

export const getCacheStatus = () => {
  return {
    sections: !!cachedSections,
    images: !!cachedImages,
    requirements: !!cachedRequirements,
    sectionsCount: cachedSections?.length || 0,
    imagesCount: Object.keys(cachedImages || {}).length,
    requirementsCount: Object.keys(cachedRequirements || {}).length
  };
};

// Preload essential data
export const preloadEssentialData = async () => {
  try {
    console.log('Preloading essential event data...');
    const [sections, images] = await Promise.allSettled([
      getEventSectionsFromApi(),
      getEventImagesFromApi()
    ]);
    
    console.log('Preload results:', {
      sections: sections.status,
      images: images.status
    });
    
    return {
      sections: sections.status === 'fulfilled' ? sections.value : null,
      images: images.status === 'fulfilled' ? images.value : null
    };
  } catch (error) {
    console.warn('Failed to preload essential data:', error);
    return { sections: null, images: null };
  }
};