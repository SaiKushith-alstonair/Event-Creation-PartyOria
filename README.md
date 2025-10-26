<<<<<<< HEAD
# PartyOria Event Management System - Frontend

A comprehensive event creation platform built with React, TypeScript, and Tailwind CSS, featuring 106+ event types and dynamic vendor management.

## Features

- **106+ Event Types**: Complete coverage across 11 major categories
- **Dynamic Page Rendering**: Only selected event pages are visible
- **Smart Vendor Mapping**: Context-aware vendor suggestions
- **Festival Sub-types**: Dynamic filtering for festival celebrations
- **TypeScript**: Full type safety and better development experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Validation**: Comprehensive form validation
- **Search & Filter**: Advanced vendor and event search capabilities
- **Budget Management**: Support for custom budget ranges over ₹50,000
- **Tradition Styles**: Wedding, Festival, and Birthday tradition options
- **Organizer Selection**: Fallback organizer data when API unavailable

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Backend Integration

This frontend connects to a Django REST API backend. Make sure the backend is running on `http://localhost:8000`.

## Key Components

- **EventCreator**: Main container component managing state
- **FormSteps**: Handles step rendering and navigation
- **TraditionSelector**: Dynamic tradition styles based on event type
- **LocationSelector**: State/city selection with search
- **VendorSelectionModal**: Vendor selection with fallback data
- **OrganizerSelectionModal**: Organizer selection with fallback data
- **EventDetailsModal**: Complete event information display

## Recent Updates

- Added fallback tradition styles for wedding, festival, and birthday events
- Implemented actual budget value storage for "Over ₹50,000" range
- Added fallback organizer data when API is unavailable
- Fixed form data clearing for new events while preserving edit functionality
- Enhanced vendor selection flow after organizer selection
=======
# Event-Creation
>>>>>>> 0ba6031c677c59d57f7e0e4dc1ae4c7002a79f59
