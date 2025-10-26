#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'partyoria.settings')
django.setup()

from events.models import EventRequirement, RequirementQuestion

def add_photography_questions():
    # Find the event-photography requirement for seminar
    requirement = EventRequirement.objects.filter(
        requirement_id='event-photography',
        event_id='seminar'
    ).first()
    
    if not requirement:
        print("Event photography requirement not found for seminar")
        return
    
    # Clear existing questions
    RequirementQuestion.objects.filter(requirement=requirement).delete()
    
    # Add new questions
    questions = [
        {
            'question_text': 'How many hours of photography coverage do you need?',
            'question_type': 'dropdown',
            'options': ['2-3 hours', '4-6 hours', '8 hours', 'Full day (10+ hours)'],
            'is_required': True,
            'order': 1
        },
        {
            'question_text': 'What type of photography style do you prefer?',
            'question_type': 'radio',
            'options': ['Candid/Documentary', 'Traditional/Posed', 'Artistic/Creative', 'Mix of all styles'],
            'is_required': True,
            'order': 2
        },
        {
            'question_text': 'Do you need video coverage as well?',
            'question_type': 'radio',
            'options': ['Yes, full videography', 'Yes, highlights only', 'No, photos only'],
            'is_required': True,
            'order': 3
        },
        {
            'question_text': 'How many edited photos would you like to receive?',
            'question_type': 'dropdown',
            'options': ['50-100 photos', '100-200 photos', '200-500 photos', '500+ photos'],
            'is_required': True,
            'order': 4
        },
        {
            'question_text': 'Any specific shots or moments you want captured?',
            'question_type': 'text',
            'placeholder': 'e.g., keynote speech, networking sessions, award presentations...',
            'is_required': False,
            'order': 5
        },
        {
            'question_text': 'When do you need the photos delivered?',
            'question_type': 'radio',
            'options': ['Within 24 hours', 'Within 1 week', 'Within 2 weeks', 'Within 1 month'],
            'is_required': True,
            'order': 6
        }
    ]
    
    for q_data in questions:
        RequirementQuestion.objects.create(
            requirement=requirement,
            **q_data
        )
    
    print(f"Added {len(questions)} questions for event photography requirement")

if __name__ == '__main__':
    add_photography_questions()