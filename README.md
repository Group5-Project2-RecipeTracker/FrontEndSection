# Group 5 – Recipe Tracker & Meal Planner API

Repository:
https://github.com/Group5-Project2-RecipeTracker

## Project Overview

The Recipe Tracker & Meal Planner API allows users to create and manage recipes, add ingredients, organize weekly meal plans, manage favorite foods, and filter recipes based on preferences.

This project includes:
- Spring Boot backend API
- React web frontend
- Firebase with OAuth2 authentication
- Docker containerization
- Swagger API documentation

---

## Tech Stack

### Back End
- Spring Boot (Required)
- Spring Boot with Docker
- Spring Security with OAuth2
- Swagger for API documentation
- Firebase authentication integration
- Backend hosting planned on Heroku

### Front End
- React (Web frontend)

The frontend runs locally and connects to the live deployed API.
Optional deployment: Vercel or Netlify.

---

## Resources and Relationships

### User
- userID
- email
- password
- admin (boolean)

### Food
- foodID
- name
- picture
- nutrition (to be added)

### Meal Plan
- id
- userID (foreign key to User)
- foodID (foreign key to Food)

### Relationships
- A User can create multiple Meal Plans.
- A Meal Plan contains multiple Foods.
- Admins can manage all Users and Foods.

---

## API Design

The API follows RESTful principles:

GET    - Retrieve a resource or collection  
POST   - Create a new resource  
PUT    - Replace a resource in full  
PATCH  - Partially update a resource  
DELETE - Remove a resource  

Swagger will be used to document, test, and demonstrate API functionality.

---

## User Stories

### General Users

As a user, I want to:

- Create an account
- Login
- Sign out
- Delete my own account
- View my profile and stats
- Add new foods or ingredients
- Add foods to favorites
- Create weekly meal plans
- Add or delete items in meal plans
- Replace food in a weekly meal plan
- Filter recipes based on food preference

### Admin

As an admin, I want to:

- View all users
- View a specific user
- Update a user's status
- Delete a user and all of their data
- Add foods or recipes
- Update foods or recipes
- Delete foods or recipes
- Modify API functionality as needed

---

## Development Workflow

- Use GitHub Issues to track tasks
- Create milestones for major features
- Two approvals are required before merging pull requests
- Follow REST API best practices
