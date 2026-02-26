# Group 5 – Recipe Tracker Frontend

#  Running the App Locally

##  Install Dependencies

Open a terminal in the project root and run:

npm install

---

## Start the Development Server

npm run dev

---

##  Local Host

Once started, open your browser and go to:

http://localhost:5173

The server will automatically reload when you make changes.

## Overview

The Recipe Tracker Frontend is a React-based web application that connects to the Group 5 Recipe Tracker & Meal Planner API.

This application allows users to:

- Create and manage accounts
- Log in and log out securely using OAuth2 authentication
- Create and manage weekly meal plans
- Add, delete, and replace foods in meal plans
- Add foods to favorites
- Filter recipes based on food preferences
- View profile information and user statistics

The frontend communicates with a live Spring Boot backend API.

[Application Mock Up](https://www.figma.com/make/HdItIJHavBLz9ZtOwReDFr/Food-Tracking-and-Recommendation-Site?t=qHGGrrXMfMJUUZby-1).


---

## Tech Stack

- React
- JavaScript (ES6+)
- Fetch API or Axios (for API calls)
- Firebase Authentication (OAuth2 integration)
- Optional Deployment: Vercel or Netlify

---



### Components
Reusable UI elements such as:
- Navigation bar
- Forms
- Meal plan cards
- Food/recipe display cards

### Pages
- Login
- Register
- Dashboard
- Profile
- Meal Planner

### Services
Handles API calls to the backend:
- Authentication requests
- CRUD operations for users
- CRUD operations for foods
- CRUD operations for meal plans

---

## API Communication

The frontend interacts with the backend using RESTful endpoints:

GET    - Retrieve data  
POST   - Create new resources  
PUT    - Replace full resources  
PATCH  - Update partial resources  
DELETE - Remove resources  

All requests are sent to the configured backend API URL.

---

## Authentication

Authentication is handled using Firebase and OAuth2.

Features:
- Secure login
- Secure logout
- Token-based authentication
- Protected routes
- Role-based access (Admin vs User)

---

## Development Workflow

- Use feature branches
- Submit pull requests
- Two approvals required before merging
- Follow consistent code formatting
- Write clean, modular React components

---

## Future Improvements

- Improve UI and styling
- Add advanced filtering options
- Add nutrition display details
- Improve performance optimization
