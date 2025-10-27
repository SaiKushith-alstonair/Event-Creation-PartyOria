import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface Question {
  id: number;
  question_text: string;
  question_type: 'text' | 'number' | 'dropdown' | 'checkbox' | 'radio';
  options?: string[];
  placeholder?: string;
  min_value?: number;
  max_value?: number;
  is_required: boolean;
  order: number;
}

interface Requirement {
  id: string;
  label: string;
  category: string;
}

interface RequirementQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: {
    id: string;
    label: string;
  };
  eventId?: string;
  eventType?: string;
  onSave: (answers: Record<string, any>) => void;
}

const RequirementQuestionsModal: React.FC<RequirementQuestionsModalProps> = ({
  isOpen,
  onClose,
  requirement,
  eventId,
  eventType,
  onSave
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'gallery' | 'questions'>('gallery');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const fetchGalleryImages = async (requirementId: string) => {
    setLoadingImages(true);
    try {
      const eventName = eventId || eventType?.toLowerCase().replace(/\s+/g, '-') || 'conference';
      const response = await fetch(`http://localhost:8000/api/events/requirement-images/?requirement_name=${requirementId}&event_name=${eventName}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.images && data.images.length > 0) {
          setGalleryImages(data.images);
          console.log(`Found ${data.images.length} images for ${requirementId} in ${eventName}`);
        } else {
          setGalleryImages([]);
        }
      } else {
        setGalleryImages([]);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setGalleryImages([]);
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    if (isOpen && requirement.id) {
      setCurrentImageIndex(0);
      fetchGalleryImages(requirement.id);
      fetchQuestions();
    }
  }, [isOpen, requirement.id, eventId, eventType]);

  useEffect(() => {
    if (galleryImages.length > 0) {
      setCurrentView('gallery');
    } else {
      setCurrentView('questions');
    }
  }, [galleryImages]);

  const getFallbackQuestions = (requirementId: string): Question[] => {
    return [
      { id: 1, question_text: 'Quantity needed?', question_type: 'number', min_value: 1, max_value: 100, is_required: true, order: 1 },
      { id: 2, question_text: 'Special requirements?', question_type: 'text', placeholder: 'Any specific needs', is_required: false, order: 2 }
    ];
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // Try multiple approaches to find questions
      const searchIds = [requirement.id, eventId, eventType?.toLowerCase().replace(/\s+/g, '-')];
      
      let questionsToUse: Question[] = [];
      
      for (const searchId of searchIds) {
        if (!searchId) continue;
        
        const params = new URLSearchParams({ requirement_id: searchId });
        if (eventId) params.append('event_id', eventId);
        
        const response = await fetch(`http://localhost:8000/api/events/requirement-questions/?${params}`);
        const data = await response.json();
        
        if (data.questions && data.questions.length > 0) {
          questionsToUse = data.questions;
          console.log(`Found ${questionsToUse.length} questions for ${searchId}`);
          break;
        }
      }
      
      if (questionsToUse.length === 0) {
        console.warn(`No questions found for ${requirement.id}, using fallback`);
        questionsToUse = getFallbackQuestions(requirement.id);
      }
      
      setQuestions(questionsToUse);
      const initialAnswers: Record<string, any> = {};
      questionsToUse.forEach((q: Question) => {
        initialAnswers[q.id] = q.question_type === 'checkbox' ? [] : '';
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error fetching questions:', error);
      const fallbackQuestions = getFallbackQuestions(requirement.id);
      setQuestions(fallbackQuestions);
      const initialAnswers: Record<string, any> = {};
      fallbackQuestions.forEach((q: Question) => {
        initialAnswers[q.id] = q.question_type === 'checkbox' ? [] : '';
      });
      setAnswers(initialAnswers);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCheckboxChange = (questionId: number, option: string, checked: boolean) => {
    setAnswers(prev => {
      const currentValues = prev[questionId] || [];
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentValues, option]
        };
      } else {
        return {
          ...prev,
          [questionId]: currentValues.filter((v: string) => v !== option)
        };
      }
    });
  };



  const handleSave = () => {
    // Save answers with requirement details
    const savedData = {
      requirementId: requirement.id,
      requirementLabel: requirement.label,
      answers: answers,
      questions: questions
    };
    onSave(savedData);
    onClose();
  };

  const renderQuestion = (question: Question) => {
    switch (question.question_type) {
      case 'text':
        return (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value) || '')}
            min={question.min_value}
            max={question.max_value}
            placeholder={question.placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        );

      case 'dropdown':
        return (
          <select
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select an option</option>
            {question.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(answers[question.id] || []).includes(option)}
                  onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center p-4" 
      style={{ zIndex: 99999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          console.log('Modal backdrop clicked');
        }
      }}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/30 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {requirement.label} - Additional Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-gradient-to-br from-purple-50 via-amber-50 to-orange-50">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {currentView === 'gallery' && galleryImages.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
                    <span>🖼️</span> {requirement.label} Gallery
                  </h3>
                  {loadingImages ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                  ) : (
                    <>
                      <div className="relative flex items-center justify-center">
                        {galleryImages.length > 1 && (
                          <button
                            onClick={() => setCurrentImageIndex(prev => prev === 0 ? galleryImages.length - 1 : prev - 1)}
                            className="absolute left-4 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                          >
                            ←
                          </button>
                        )}
                        <div className="w-full max-w-lg">
                          <img
                            src={galleryImages[currentImageIndex]}
                            alt={`${requirement.label} ${currentImageIndex + 1}`}
                            className="w-full h-80 object-cover rounded-xl border-3 border-gray-200 shadow-xl"
                            onLoad={() => console.log('Image loaded successfully:', galleryImages[currentImageIndex])}
                            onError={(e) => {
                              console.error('Image failed to load:', galleryImages[currentImageIndex]);
                              e.currentTarget.src = 'https://via.placeholder.com/400x320/f3f4f6/9ca3af?text=Image+Not+Available';
                            }}
                          />
                        </div>
                        {galleryImages.length > 1 && (
                          <button
                            onClick={() => setCurrentImageIndex(prev => prev === galleryImages.length - 1 ? 0 : prev + 1)}
                            className="absolute right-4 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                          >
                            →
                          </button>
                        )}
                      </div>
                      {galleryImages.length > 1 && (
                        <div className="flex justify-center mt-4 gap-2">
                          {galleryImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentImageIndex ? 'bg-purple-500' : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <p className="text-center text-gray-600 italic mt-6 text-lg">
                        Style {currentImageIndex + 1} of {galleryImages.length} - {requirement.label.toLowerCase()}
                      </p>
                    </>
                  )}
                </div>
              )}

              {currentView === 'questions' && (
                <div className="space-y-4">
                  {questions.length > 0 ? (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <span>❓</span> Additional Details
                      </h3>
                      {questions.map((question) => (
                        <div key={question.id} className="space-y-2 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-sm">
                          <label className="block text-sm font-medium text-gray-700">
                            {question.question_text}
                            {question.is_required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {renderQuestion(question)}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No additional questions available for this requirement.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between p-6 border-t border-gray-200">
          <button
            onClick={() => {
              if (currentView === 'questions' && galleryImages.length > 0) {
                setCurrentView('gallery');
              } else {
                onClose();
              }
            }}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 text-gray-600 hover:text-gray-800 bg-gray-100/80 backdrop-blur-sm hover:bg-gray-200/80 hover:shadow-lg hover:-translate-x-1"
          >
            ← {currentView === 'questions' && galleryImages.length > 0 ? 'Gallery' : 'Back'}
          </button>
          <button
            onClick={() => {
              if (currentView === 'gallery') {
                setCurrentView('questions');
              } else {
                handleSave();
              }
            }}
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-x-1 hover:-translate-y-1 disabled:opacity-50"
          >
            {currentView === 'gallery' ? 'Continue →' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default RequirementQuestionsModal;