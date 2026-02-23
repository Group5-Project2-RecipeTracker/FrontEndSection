Group 5 – Recipe Tracker & Meal Planner API
Repository:
https://github.com/Group5-Project2-RecipeTracker
Project Overview
The Recipe Tracker & Meal Planner API allows users to create and manage recipes, add ingredients, organize weekly meal plans, manage favorite foods, and filter recipes based on preferences.
Tech Stack
Back End: Spring Boot
Spring Boot with Docker
Spring Security with OAuth2
Swagger for API documentation
Firebase for authentication integration
Backend Hosting: Heroku (planned)
Front End: React
Frontend runs locally and connects to live API
Resources and Relationships
User
userID
email
password
admin (boolean)
Food
foodID
name
picture
nutrition (to be added)
Meal Plan
id
userID (foreign key)
foodID (foreign key)
Relationships
A User can create multiple Meal Plans.
A Meal Plan contains multiple Foods.
Admins can manage all Users and Foods.
API Design
The API follows RESTful principles.
GET: Retrieve a resource or collection
POST: Create a new resource
PUT: Replace a resource in full
PATCH: Partially update a resource
DELETE: Remove a resource
Swagger will be used to document and demonstrate API functionality.
User Stories
General Users
Create an account
Login
Sign out
Delete their own account
View profile and stats
Add new foods or ingredients
Add foods to favorites
Create weekly meal plans
Add or delete items in meal plans
Replace food in weekly meal plans
Filter recipes based on food preference
Admin
View all users
View a specific user
Update user status
Delete a user and their data
Add foods or recipes
Update foods or recipes
Delete foods or recipes
Modify API functionality as needed
Development Workflow
Use GitHub Issues to track tasks
Create milestones for major features
Two approvals required before merging pull requests
Follow REST API best practices
