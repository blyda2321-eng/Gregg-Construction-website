# Gregg Construction - Design Build Platform

A professional design-build general contractor platform that allows clients to create accounts, design their custom home or commercial building, and select materials from a curated catalog. Contractors have full access to pricing, estimates, and takeoff generation.

## Features

### Client Features
- Account creation and authentication
- Project creation wizard with climate zone detection
- Material selection by category
- Smart home system integration
- Project summary and selection management
- Mobile-friendly responsive design

### Contractor Features
- Full admin dashboard
- Complete pricing visibility
- Estimate generation with markup controls
- Material takeoff export
- Client management
- Project status tracking

## Tech Stack

### Backend
- Python Django 4.2
- Django REST Framework
- PostgreSQL
- Redis for caching
- JWT Authentication

### Frontend
- React 18
- Tailwind CSS
- Framer Motion animations
- React Hook Form
- Axios for API calls

## Getting Started

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
