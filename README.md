# Team Finder

This is the Vue-based frontend application for the Team Finder project, built with Vite and provides Axios clients to make REST calls to the backend.

## Project Description

Team Finder is a full-stack application designed to help organize soccer/football teams. The application allows users to:

- Manage player profiles with detailed skill ratings
- Create balanced teams automatically
- View and edit player information
- Compare team compositions

## Technologies Used

- Vue 3.2.45
  - Composition API
- Pinia 2.1.7 (State Management)
- TailwindCSS 3.3.5 (Responsive Styling)
- TypeScript 4.7.4
- Vitest 0.25.3 (Testing)
- Axios (API Requests)
- Responsive Design
  - Mobile-first approach
  - Adaptive layouts

## Getting Started

### Prerequisites

- Node 21 or higher
- NPM 10.9.2
- Backend service running (see team-finder-backend folder)

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

### Running the Application

1. Build the project:
   ```
   npm run build
   ```
2. Run the project with hot reloading:
   ```
   npm run dev
   ```
   The application will start on port 5173 by default.

## Project Architecture

### Directory Structure

- `/src`: Main source code
  - `/api`: API client and interfaces
  - `/components`: Vue components organized by feature
  - `/router`: Vue Router configuration (with auth guards)
  - `/stores`: Pinia state management stores

### Key Components

- `HeaderBar`: Responsive navigation with mobile hamburger menu
- `BottomNavigation`: Mobile-friendly navigation bar (visible on small screens only)
- `PlayerProfilesOverview`: Displays all players with editing capabilities (admin only)
- `TeamsOverview`: Shows balanced teams and allows reshuffling
- `AddPlayer`: Form for adding new players with detailed skill ratings (admin only)
- `PlayerProfile`: Detailed player information with responsive layout
- `PlayerProfileShort`: Compact player card that adapts to screen size
- `TeamCreation`: Team generation workflow
- `AdminLoginDialog`: Secure login form with JWT authentication

### State Management

The application uses Pinia for state management with the following stores:

- `playerStore`: Manages player data, selection, and team creation
- `adminStore`: Handles authentication state, JWT tokens, and role-based access control

### API Integration

The frontend communicates with the Spring Boot backend using Axios:

- Base URL: http://localhost:9000/api (configurable)
- Secured with JWT tokens in Authorization header
- Endpoints:
  - Auth: User authentication with JWT
  - Players: CRUD operations for player management (some require authentication)
  - Teams: Endpoints for team creation and management

## Data Model

### Player

- id: Long (PK)
- name: String
- rating: Integer (overall rating calculated from skills)
- handynummer: String (phone number)
- imgSrc: String (profile image URL/base64)

### PlayerSkill

- skill: String (e.g., "Schnelligkeit", "Dribbling", etc.)
- rating: Integer (1-100)

## Development

### Adding New Features

1. Create new components in the `/components` directory
2. Update the router configuration if adding new pages
3. Extend the API client in `/api.ts` for new endpoints
4. Update state management in the appropriate store

### Testing

Run the tests with:

```
npm run test
```

### Building for Production

```
npm run build
```

## Backend Integration

This frontend is designed to work with the Spring Boot backend found in the `team-finder-backend` directory. Ensure the backend is running before starting the frontend application.

## Responsive Design

The application is designed to work optimally on both desktop and mobile devices:

### Mobile View
- Bottom navigation bar for easy access to key features
- Hamburger menu in the header for secondary navigation
- Stack layout for player cards on small screens
- Optimized component sizes and spacing
- Touch-friendly UI elements

### Tablet/Desktop View
- Expanded header navigation
- Horizontal layout for player lists
- No bottom navigation to maximize screen space
- Enhanced hover effects for better desktop experience

## License

This project is not licensed for public use.
