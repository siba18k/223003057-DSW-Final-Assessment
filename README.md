# Hotel Booking App

## Overview

A modern React Native hotel booking application built with Expo, featuring Firebase authentication and real-time data management. The app allows users to discover hotels, view detailed information, make bookings, and manage their profile.

## Features

### Authentication
- **User Registration & Login**: Secure email/password authentication
- **Forgot Password**: Password reset functionality via email
- **Onboarding**: Welcome screens for new users
- **Profile Management**: Update user information and view booking history

### Hotel Discovery
- **Explore Hotels**: Browse available hotels with detailed information
- **Hotel Details**: View comprehensive hotel information including amenities, images, and pricing
- **Reviews & Ratings**: Read and write hotel reviews
- **Search & Filter**: Find hotels based on preferences

### Booking System
- **Date Selection**: Choose check-in and check-out dates
- **Room Selection**: Pick from available room types
- **Booking Confirmation**: Secure booking process with confirmation
- **Booking History**: View past and current bookings

### User Interface
- **Modern Design**: Clean and intuitive user interface
- **Tab Navigation**: Easy navigation between main sections
- **Responsive Layout**: Optimized for various screen sizes
- **Loading States**: Smooth user experience with proper loading indicators

## Tech Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Navigation**: Navigation library for screen transitions
- **React Context**: State management for authentication

### Backend
- **Firebase Auth**: User authentication and management
- **Firestore**: Real-time database for app data
- **AsyncStorage**: Local storage for user preferences

### UI Components
- **Expo Vector Icons**: Icon library
- **React Native DateTimePicker**: Date selection component
- **React Native Gesture Handler**: Touch gesture management
- **React Native Safe Area Context**: Safe area handling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)
- Firebase project with Authentication and Firestore enabled

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/siba18k/223003057-DSW-Final-Assessment.git
   cd 223003057-DSW-Final-Assessment/HotelBookingApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Update `config/firebase.js` with your Firebase configuration

4. **Run the application**
   ```bash
   # Start Expo development server
   npm start
   
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   ```

## Project Structure

```
HotelBookingApp/
├── config/
│   └── firebase.js          # Firebase configuration
├── context/
│   └── AuthContext.js       # Authentication context
├── screens/
│   ├── OnboardingScreen.js  # Welcome/intro screens
│   ├── SignInScreen.js      # User login
│   ├── SignUpScreen.js      # User registration
│   ├── ForgotPasswordScreen.js # Password reset
│   ├── ExploreScreen.js     # Hotel discovery
│   ├── HotelDetailScreen.js # Hotel information
│   ├── BookingScreen.js     # Booking process
│   ├── BookingSuccessScreen.js # Booking confirmation
│   ├── ProfileScreen.js     # User profile
│   └── ReviewsScreen.js     # Hotel reviews
├── assets/                  # Images and static assets
├── App.js                   # Main application component
├── index.js                 # App entry point
└── package.json            # Dependencies and scripts
```

## Key Components

### Authentication Flow
- Users start with onboarding screens
- Sign up/Sign in with email and password
- Password reset functionality available
- Authenticated users access main app features

### Navigation Structure
- **Auth Stack**: Login, Register, Forgot Password
- **Main Tabs**: Explore, Profile
- **App Stack**: Hotel Details, Booking, Reviews

### Data Management
- Firebase Firestore for real-time data
- User profiles stored with booking history
- Hotel data and reviews managed in collections
- Local storage for user preferences and onboarding state

## Firebase Setup

### Collections Structure
```
users/
├── {userId}/
│   ├── displayName: string
│   ├── email: string
│   ├── createdAt: timestamp
│   └── bookings: array

hotels/
├── {hotelId}/
│   ├── name: string
│   ├── location: string
│   ├── price: number
│   ├── rating: number
│   ├── amenities: array
│   └── images: array

reviews/
├── {reviewId}/
│   ├── hotelId: string
│   ├── userId: string
│   ├── rating: number
│   ├── comment: string
│   └── timestamp: timestamp
```

## Development

### Available Scripts
- `npm start`: Start Expo development server
- `npm run android`: Run on Android device/emulator
- `npm run ios`: Run on iOS device/simulator
- `npm run web`: Run in web browser

### Building for Production
- Use `expo build:android` for Android APK
- Use `expo build:ios` for iOS IPA
- Configure app signing and store credentials as needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and intended for educational purposes.

---

**Note**: Make sure to configure your Firebase project properly and update the configuration file with your actual Firebase credentials before running the application.