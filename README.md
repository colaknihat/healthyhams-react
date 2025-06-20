# HealthyHams - Nutrition Tracking App

A React Native application for tracking nutrition and managing personal health information.

## Features

### 🏠 Home Screen
- Daily nutrition tracking with visual progress bars
- Food database with nutritional information
- Real-time calorie, protein, carbs, and fat tracking
- Modern card-based UI design

### 📅 Calendar Page
- View past meal tracking data in a monthly calendar view
- Visual indicators for days with recorded meals
- Detailed meal history for any selected date
- Edit past meal data (add/remove meals)
- Daily nutrition summaries for historical dates
- Intuitive month navigation

### 👤 Profile Settings
- Comprehensive personal information management
- BMI calculation with health category indicators
- Daily calorie recommendations based on personal data
- Activity level selection with detailed descriptions
- Modern profile page design with save functionality
- Form validation and user feedback

### 📱 Navigation
- Bottom navigation bar with intuitive icons
- Smooth transitions between screens
- Proper navigation stack management
- Calendar access from all main screens

## Technical Details

### Dependencies
- React Native 0.73.6
- React Navigation v6 (Native Stack)
- React Native Community Slider
- React Native Splash Screen

### Navigation Structure
- HomeScreen (Main dashboard)
- Calendar (Meal history and editing)
- PersonalSettings (Profile management)
- Login (Authentication)
- Ask (User onboarding)
- Details (Food details)

## Recent Updates

### Calendar Feature Addition
- ✅ Added comprehensive calendar page for meal tracking history
- ✅ Visual calendar with meal data indicators
- ✅ Detailed meal view with nutrition summaries
- ✅ Edit functionality for past meal data
- ✅ Integrated calendar navigation in bottom nav bar
- ✅ Month navigation with intuitive controls

### PersonalSettings Page Redesign
- ✅ Fixed navigation bar disappearing issue
- ✅ Redesigned as a modern profile page
- ✅ Added proper save button with validation
- ✅ Improved UI with sections and cards
- ✅ Added BMI category indicators
- ✅ Enhanced user experience with alerts and feedback

## Calendar Features

### 📊 Visual Calendar
- Monthly view with clear day indicators
- Green highlighting for days with meal data
- Today indicator for current date
- Easy month navigation with arrow buttons

### 📝 Meal History Management
- View detailed meal lists for any date
- Complete nutrition breakdown per day
- Add new meals to past dates
- Remove meals from historical data
- Real-time nutrition calculations

### 🎯 Data Visualization
- Daily nutrition summaries (calories, protein, carbs, fat)
- Color-coded BMI categories
- Progress tracking over time
- Clear meal organization by date

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Metro bundler:
   ```bash
   npm start
   ```

3. Run on Android:
   ```bash
   npm run android
   ```

4. Run on iOS:
   ```bash
   npm run ios
   ```

## Project Structure

```
healthyhams/
├── components/
│   ├── Homescreen.js      # Main dashboard
│   ├── Calendar.js        # Meal history calendar
│   ├── PersonalSettings.js # Profile management
│   ├── Login.js           # Authentication
│   ├── Ask.js             # User onboarding
│   └── Details.js         # Food details
├── assets/
│   ├── images/            # App images
│   └── icons/             # Navigation icons
├── App.tsx                # Main app component
└── package.json           # Dependencies
```

## Usage Guide

### Using the Calendar
1. Tap the 📅 calendar icon in the bottom navigation
2. Browse months using the arrow buttons
3. Tap any date to view/edit meal data
4. Add meals using the "Add Meal" section
5. Remove meals using the red "Remove" buttons
6. View daily nutrition summaries at the top

### Navigation Tips
- Calendar is accessible from all main screens
- Days with meal data show green highlighting
- Today's date is highlighted in green
- Selected dates show in dark color

## Contributing

When making changes to the Calendar page:
1. Ensure meal data persistence across sessions
2. Maintain proper date formatting and calculations
3. Keep the modal interface responsive
4. Follow the established design patterns
5. Test month navigation thoroughly

When making changes to navigation:
1. Update all screens with navigation bars
2. Maintain consistent icon sizing and spacing
3. Ensure proper navigation flow between screens
