# Internal Project Manager SPA

## Description
A single page application built with vanilla JavaScript and Vite for internal project management. The app supports login, role-based access control, session persistence, and CRUD operations with a simulated REST API via `json-server`.

## Technologies
- Vite
- Vanilla JavaScript (ES Modules)
- Fetch API
- json-server
- CSS

## Installation
1. Open a terminal in the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open the URL shown by Vite in your browser.

## Running JSON Server
1. Start the simulated API server:
   ```bash
   npm run json-server
   ```
2. The app expects the API at `http://localhost:3000`.

## Test Users
- Manager
  - email: `manager@test.com`
  - password: `123456`
  - role: `manager`
- Collaborator
  - email: `user@test.com`
  - password: `123456`
  - role: `collaborator`

## Project Structure
- `index.html` — Application entry point.
- `package.json` — Scripts and dependencies.
- `vite.config.js` — Vite configuration.
- `db.json` — Simulated API data for json-server.
- `src/main.js` — Bootstraps the app and manages login state.
- `src/api.js` — REST wrappers for fetch requests.
- `src/auth.js` — Session persistence and authentication logic.
- `src/router.js` — Client-side routing for SPA navigation.
- `src/ui.js` — Layout rendering and toast notifications.
- `src/dashboard.js` — Dashboard rendering by role.
- `src/projects.js` — Project list, detail, create, edit, and delete views.
- `src/styles.css` — Application styling.

## Role Permissions
- **Manager**
  - View all projects
  - Create projects
  - Edit any project
  - Delete projects
  - View any project details
- **Collaborator**
  - View only assigned projects
  - View project details
  - Update status if assigned
  - Cannot create or delete projects
  - Cannot modify projects assigned to others

## Technical Decisions
- Used Vite for fast development and ES module support.
- Implemented role-based UI and route protection in JavaScript.
- Persisted authentication with `localStorage` so session survives refreshes.
- Used `json-server` for API simulation, including GET, POST, PATCH, and DELETE.
- Modular code separated into API, auth, routing, view rendering, and state modules.

## Restrictions
- No user registration is available.
- The app only works with predefined users from `db.json`.
- Data persistence requires `json-server`.
