# IndiLegal Research App

A React Native Expo app that works for web, Android, and iOS. This is a legal case research platform inspired by indiancases.com, designed with modern UI/UX principles and responsive layout.

## Features

- **Multi-platform:** Build for web, Android, and iOS from a single codebase
- **Case Search:** Comprehensive search functionality with advanced filters
- **Responsive Design:** Works well on mobile, tablet, and desktop
- **Case Management:** View, bookmark, and download cases
- **User Profile:** User management with activity tracking

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Expo Vector Icons** for icons
- **CSS-in-JS** styling system
- **Responsive Components** for multi-device support

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone or ensure the project files are ready
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

#### Development

1. Start the Expo development server:
   ```bash
   npm start
   ```

#### Platform-specific runs

1. **Web**: 
   ```bash
   npm run web
   ```

2. **Android**:
   ```bash
   npm run android
   ```
   Note: Requires Android Studio and Android SDK setup.

3. **iOS**:
   ```bash
   npm run ios
   ```
   Note: Requires Xcode and macOS (or use Expo Go app).

## App Structure

```
src/
├── components/          # Reusable UI components
│   ├── CaseCard.tsx
│   ├── SearchBar.tsx
│   └── ResponsiveContainer.tsx
├── constants/          # App constants
│   └── index.ts
├── screens/            # App screens
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── SearchScreen.tsx
│   ├── CaseDetailScreen.tsx
│   └── ProfileScreen.tsx
└── types/              # TypeScript type definitions
    └── index.ts
```

## Key Components

### Screens

1. **Login Screen**: Welcome screen with dark theme, infinity logo, and verification options
2. **Home Screen**: Landing page with search functionality and recent cases
3. **Search Screen**: Advanced search with filters for courts, categories, and dates
4. **Case Detail Screen**: Full case information with actions
5. **Profile Screen**: User account management and preferences

### Features Implemented

1. **Search & Filter System**
   - Text-based case search
   - Court filtering
   - Category filtering
   - Status filtering
   - Year-based filtering

2. **Case Display**
   - Case cards with key information
   - Detailed case views
   - Bookmark functionality
   - Download capabilities

3. **Responsive Layout**
   - Mobile-first design
   - Tablet optimization
   - Desktop web support

## Adding API Integration

When ready to integrate with real APIs:

1. Replace static data in `constants/index.ts` with API calls
2. Add network request libraries (axios, fetch)
3. Implement real authentication
4. Add proper error handling and loading states

## Development Notes

- The app uses static data for demonstration
- Navigation is set up with React Navigation
- Styling uses StyleSheet with design tokens
- All types are defined in TypeScript
- Components are designed to be reusable

## Contributing

1. Follow the existing code structure
2. Use TypeScript typing
3. Implement features responsive design
4. Maintain component documentation

## Future Enhancements

- API Integration with backend services
- Offline data sync
- Advanced search (search across full text)
- Push notifications for new cases
- User bookmarking and history

