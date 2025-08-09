
# Idea Bank - Innovation Platform

This is a full-featured web platform for innovation and idea management.

## Project Overview

The "Idea Bank" is a platform designed to foster innovation by allowing users to submit, track, and collaborate on ideas. It features a modern, clean, and engaging user interface with a "bee and honeycomb" theme to represent cooperation and diligence.

### Features

-   **Idea Submission:** Anonymous and authenticated users can submit ideas through a simple form.
-   **Idea Tracking:** Users can track the status of their submitted ideas.
-   **Featured Ideas:** The home page displays a dynamic feed of the most liked or most recent approved ideas.
-   **User Authentication:** A full-featured authentication system allows users to sign up, log in, and manage their account.
-   **Admin Panel:** A comprehensive admin panel for managing ideas, users, and other platform content.

### Technology Stack

-   **Backend:** Python, Django, Django REST Framework
-   **Frontend:** React.js, Tailwind CSS
-   **Database:** PostgreSQL

## Getting Started

### Prerequisites

-   Python 3.12+
-   Node.js and npm
-   PostgreSQL

### Backend Setup

1.  Navigate to the `backend` directory: `cd backend`
2.  Install Python dependencies: `pip install -r requirements.txt`
3.  Set up your PostgreSQL database and configure the connection in `backend/idea_bank/settings.py`.
4.  Apply database migrations: `python manage.py migrate`
5.  Create a superuser to access the admin panel: `python manage.py createsuperuser`
6.  Run the backend development server: `python manage.py runserver`

### Frontend Setup

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install Node.js dependencies: `npm install`
3.  Run the frontend development server: `npm start`

The frontend will be available at `http://localhost:3000` and will proxy API requests to the backend at `http://localhost:8000`.

## Technical Improvement Backlog

-   **Security:** Migrate from using `localStorage` for authentication tokens to using secure, `HttpOnly` cookies to better protect against Cross-Site Scripting (XSS) attacks.
-   **API Security:** The idea tracking endpoint should be secured to ensure that users can only view the details of ideas they have submitted (by validating the provided email against the idea's `submitted_by_email` field on the backend).

## Asset Credits

The icons used in this project are from Flaticon. The design brief specified the following icons:
- Bee Icon: `https://www.flaticon.com/br/icone-gratis/abelha_7352191`
- Insect Icon: `https://www.flaticon.com/br/icone-gratis/inseto_12168378`
- Honeycomb Icon: `https://www.flaticon.com/br/icone-gratis/caixa-de-abelha_12640713`
Thank you to the creators of these icons.
=======
