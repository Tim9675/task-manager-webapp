# Task Management Web App

A full-stack task management application built with the MERN stack. This project is focused on building a modern productivity platform with list-based task organization, task editing, and a responsive user experience while following real-world full-stack development practices.

## Overview

This project was built as part of my journey toward becoming a full-stack/software developer. The application is designed to help users organize tasks into lists, manage task details efficiently, and provide a clean and intuitive productivity workflow.

The project is also being used as a learning platform for:

* Full-stack application architecture
* REST API development
* MongoDB data modeling
* React state management
* Authentication and authorization
* CRUD operations
* Frontend/backend integration
* Scalable project structure

Although the current stack uses MERN, I am intentionally focusing on transferable software engineering concepts that can be applied across different frameworks and languages.

---

# Tech Stack

## Frontend

* React
* React Router
* Material UI (MUI)
* Lucide React Icons
* Tailwind CSS / Responsive Layouts

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Development Tools

* Git & GitHub
* VS Code
* Postman

---

# Current Features (As of May 17, 2026)

## Task Management

* Create tasks
* Edit/update tasks
* Delete tasks
* Toggle task completion
* Render tasks dynamically from database data
* Organize tasks into lists/categories

## Frontend Features

* Component-based UI
* Reusable task card components
* Form handling for task updates
* Conditional rendering for task/list data
* Interactive UI elements using Material UI and Lucide icons

## Backend Features

* RESTful API architecture
* CRUD endpoints for tasks and lists
* MongoDB database integration using Mongoose
* Structured schema models
* Data persistence

---

# Features Currently In Progress

The following features are planned or currently being implemented:

* User authentication & authorization
* Protected routes
* Search and filtering
* Better error handling and validation
* List Management
  - Create lists
  - Update list information
  - Delete lists
  - Dynamic task rendering per list
* Rate limiting with notification
* Deployment and production configuration

---

# Project Goals

This project is not just about building a task manager, but it is also focused on practicing real-world software engineering workflows and preparing for entry-level full-stack/software development roles.

Key goals include:

* Writing maintainable and scalable code
* Improving frontend/backend integration skills
* Learning proper API design patterns
* Understanding database relationships and modeling
* Practicing debugging and feature iteration
* Building a strong portfolio project

---

# Installation

## Clone the repository

```bash
git clone <repository-url>
```

## Navigate into the project folder

```bash
cd <project-folder>
```

## Install frontend dependencies

```bash
cd client
npm install
```

## Install backend dependencies

```bash
cd server
npm install
```

---

# Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

UPSTASH_REDIS_REST_URL=your_upstashredis_url
UPSTASH_REDIS_REST_TOKEN=your_upstashredis_token

JWT_SECRET_KEY=your_jwt_key
```

---

# Running the Project

## Start the backend

```bash
npm run dev
```

## Start the frontend

```bash
npm start
```

---

# Folder Structure

```text
project-root/
│
├── client/
│   ├── public/
│   ├── src/
|   |   ├── api/
|   |   ├── components/
|   |   ├── context/
|   |   ├── layouts/
|   |   ├── mock/
|   |   ├── pages/
|   |   ├── routes/
|   |   ├── App.jsx
|   |   ├── index.css
|   |   └── main.jsx
│   └── package.json
│
├── server/
│   ├── src/
|   |   ├── config/
|   |   ├── controllers/
|   |   ├── helpers/
|   |   ├── middleware/
|   |   ├── models/
|   |   ├── routes/
|   |   ├── utils/
|   |   └── server.js
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

# Learning Highlights

Some of the concepts practiced during development include:

* React component composition
* State lifting and prop management
* Controlled forms
* MongoDB document relationships
* API request handling
* Express route structuring
* Full CRUD lifecycle implementation
* Conditional rendering and dynamic UI updates

---

# Future Improvements

Potential long-term improvements:

* Dark mode
* Calendar integration
* Testing suite (Jest / Cypress)
* CI/CD pipeline

---

# Status

This project is actively being developed and continuously improved.

---

# Author

Developed by Timothy Magno.

Aspiring Full-Stack / Software Developer.
