import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { eventSections } from '../data/eventSections';
import { getEventSectionsFromApi, getEventImagesFromApi } from '../data/eventSectionsApi';
import { getHeroVideo } from '../services/videoApi';

import EventCategories from './EventCategories';
import EventTypes from './EventTypes';

interface ApiSection {
  id: string;
  name: string;
  icon: string;
  subsections: any[];
}

interface LandingPageProps {
  selectedSection: string | null;
  onSectionSelect: (sectionId: string) => void;
  onSubsectionSelect: (subsectionId: string, fromPlanButton?: boolean) => void;
  onBack: () => void;
  onShowEventList: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  selectedSection,
  onSectionSelect,
  onSubsectionSelect,
  onBack,
  onShowEventList,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiSections, setApiSections] = useState<ApiSection[]>([]);
  const [apiImages, setApiImages] = useState<Record<string, string>>({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [heroVideoUrl, setHeroVideoUrl] = useState('/videos/party-hero.mp4');


  useEffect(() => {
    if (selectedSection) {
      const mainContainer = document.querySelector('.main-container');
      if (mainContainer) {
        mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [selectedSection]);

  useEffect(() => {
    const loadApiData = async () => {
      try {
        const [sections, images, videoUrl] = await Promise.all([
          getEventSectionsFromApi(),
          getEventImagesFromApi(),
          getHeroVideo()
        ]);
        setApiSections(sections);
        setApiImages(images);
        setHeroVideoUrl(videoUrl);
      } catch (error) {
        console.warn('Failed to load API data, using fallback:', error);
        setApiSections(eventSections);
      }
      setDataLoaded(true);
    };
    loadApiData();
  }, []);

  const sectionsToUse = apiSections.length > 0 ? apiSections : eventSections;
  const selectedSectionData = sectionsToUse.find(s => s.id === selectedSection);

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (selectedSection && selectedSectionData) {
    return (
      <EventTypes
        selectedSectionData={selectedSectionData}
        apiImages={apiImages}
        onSubsectionSelect={onSubsectionSelect}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="main-container">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/partyoria symbol.png" 
                alt="PartyOria Logo" 
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                PartyOria
              </h1>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={onShowEventList}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                My Events
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative py-20 flex items-center">
        <div className="absolute inset-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-white leading-tight">
                Your Dream Event,
                <span className="block bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Our Expert Touch
                </span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                From corporate conferences to dream weddings - 130+ event types, 500+ verified vendors
              </p>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Events
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What are you celebrating today? 🎊
            </h2>
            
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25"></div>
              <div className="relative bg-white rounded-2xl p-2 shadow-xl">
                <div className="flex items-center">
                  <Search className="ml-4 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search events, categories, or vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-4 bg-transparent border-0 focus:outline-none text-gray-700 placeholder-gray-400"
                  />
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {['💼 Corporate', '💍 Wedding', '🎂 Birthday', '🎨 Cultural', '🎓 Educational'].map((chip) => (
                <button
                  key={chip}
                  className="bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 px-4 py-2 rounded-full font-medium transition-all duration-300"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="events" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Event Type</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select from 12+ categories, each with multiple event options tailored to your needs
            </p>
          </div>

          <EventCategories
            sections={sectionsToUse}
            onSectionSelect={onSectionSelect}
            searchQuery={searchQuery}
          />

          {sectionsToUse.filter(section =>
            section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.subsections.some((sub: any) => 
              sub.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
          ).length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your search terms or browse all categories.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;