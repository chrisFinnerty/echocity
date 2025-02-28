# EchoCity

## Overview

Echocity is a concert discovery platform that allows alternative music enthusiasts to find, favorite, and track their favorite artists across the US.  The app provides a user friendly interface to discover, favorite artists, mark concerts as "Interested" or "Attended" so you can build a digital history of shows you've been to!

The app is divided into four main sections:

- **Concerts:** Discover concerts across the US! The concerts page automatically defaults to your state that you reside in. The events list page lets users mark events as interested, favorite the artist(s) playing at the show, and access the event's details. Right within the event list you can access the ticket page to buy tickets to the show!
- **My Artists:** Once artists are favorited, you can view them all here on this page. Keep track of your favorites and their upcoming concerts.
- **My Concerts:** View upcoming concerts you're "Interested" in, or view past events that you "Attended". This allows you to easily revisit when/where/who you saw from a memorable show.
- **Home:** In addition, users can access dashboards on their home page with their favorite artists and upcoming concerts. From here users can access the artist detail pages and event detail pages for the respective artist.

## Tech Stack

### Front End

- **Framework:** Vite + React.js
- **Libraries:** Reactstrap, Bootstrap, React Router

### Back End

- **Framework:** Express.js
- **Libraries:** Pg, JSON Web Token (JWT)
- **Database:** PostgreSQL

## Goal

Echocity is bridging the gap for Alternative/Rock fans to discover new artists/concerts, buy tickets to those shows, and have a historical record of their concerts overtime.

## Target Users

Echocity is designed for:

- Alternative/Rock music enthusiasts who are open to discovering new artists
- Avid concert goers
- Users that want to track their concert history more easily

## API Integrations Used

- **Ticketmaster API:** For retrieving event, artist, and venue data to be used throughout the app.
[Ticketmaster Discover API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)

## Live Demo

Check out the live demo of Echocity on [Render](https://echocity.onrender.com/)

## Project Breakdown

### Database Models

- **users:** Users who can sign up, login, view, and edit their profiles/details.
- **events:** Concerts/events with event specific.
- **event\_artists:** Join table for events to artists.
- **favorite\_artists:** Favorited artists by the associated user\_id.
- **artists:** profiles with artist details that exist in the database.
- **venues:** venue details that is used for events.
- **user\_events: tracks "Interested" and "Attended" concerts for the user\_**id.

### Example Endpoints

- **Users**
  - `GET /api/users/:id` – Get user profile
  - `PATCH /api/users/:id` – Update user profile (currentUser only)
- **Events**
  - `GET /api/events` – Get list of concerts in your state or US
  - `GET /api/events/:id` – Get a specific concert's details
- **Artists**
  - `GET /api/artists/:id` – Retrieve a specific artist's profile
  ## **Favorite Artists**
  - `GET /api/favorites/:userId/artists` - Get all favorited artists for the logged-in user
  - `POST /api/favorites/artists` – Save and add artist to favorites
  - `DELETE /api/favorites/artists` – Delete a favorited artist

## Functionality Features

### User Authentication & Authorization

- **Sign Up & Login:** Secure user registration and authentication using JWT.
- **Profiles:** Users can view and edit their profiles.

### Concerts

- **Discover Concerts:** Authenticated users can view concerts and all related details, with events filtered by their state by default.
- **Mark Attendance:** Users can mark concerts as "Interested" or "Attended," building a digital record of their concert history (tracked via the `user_events` table).
- **Buy Tickets:** Every concert page includes a ticket purchase link powered by the Ticketmaster API.

### Artists

- **Explore & Favorite:** Browse detailed artist profiles and add artists to your favorites list (managed via the `favorite_artists` table).
- **Stay Updated:** Favorited artists’ profiles display upcoming concert information, keeping you in the loop.

### My Concerts and My Artists

- **My Concerts:** Easily view and manage concerts you’re interested in or have attended.
- **My Artists:** Manage your list of favorited artists and stay updated on their events.

## How to Run Locally

1. **Set Up the Database**

   - Install PostgreSQL.
   - Create a new database named `echocity`.
   - Execute the schema file `echocity-schema.sql` to set up the database tables.

2. **Install Packages**

   - Recommended Node.js version: v22.x or higher, and npm version 10.x or higher.
   - Run the following command in the project root to install dependencies:
     ```bash
     npm install
     ```

3. **Configure Environment Variables**

   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```env
     DATABASE_URL=your_database_connection_string
     FRONTEND_URL='http://localhost:5173'
     SECRET_KEY=your_secret_key
     TM_API_KEY=your_ticketmaster_api_key
     TM_API_BASE_URL=https://app.ticketmaster.com/discovery/v2
     PORT=3001
     ```

4. **Launch the Servers**

   - Start the backend server:
     ```bash
     npm run dev
     ```
   - Start the frontend server:
     ```bash
     npm run dev
     ```
   - If you have a Ticketmaster API, and want to use the ticketmasterSync.js,
     - then:
     ```bash
     npm run dev:all
     ```

5. **Access the Application**

   - Open your browser and navigate to: [http://localhost:3001/](http://localhost:3001/)
