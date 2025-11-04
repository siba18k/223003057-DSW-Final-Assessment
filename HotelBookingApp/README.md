# Hotel Booking App

A React Native hotel booking application built with Expo.

## Features

- Onboarding flow
- Email/password authentication (Firebase Auth)
- Explore hotels with search and sorting
- Hotel details with reviews
- Booking flow with date pickers
- Profile with booking history

## Tech Stack

- React Native + Expo
- React Navigation (Stack + Bottom Tabs)
- Firebase (Auth, Firestore)
- AsyncStorage

## Prerequisites

- Node.js 16+
- npm or yarn
- Expo Go app on your device
- Firebase project with Email/Password enabled and Firestore created

## Getting Started

```bash
git clone https://github.com/siba18k/223003057-DSW-Final-Assessment.git
cd 223003057-DSW-Final-Assessment/HotelBookingApp
npm install
```

## Firebase Setup

Update `config/firebase.js` with your values:

```js
const firebaseConfig = {
  apiKey: "<API_KEY>",
  authDomain: "<PROJECT_ID>.firebaseapp.com",
  databaseURL: "https://<PROJECT_ID>-default-rtdb.firebaseio.com",
  projectId: "<PROJECT_ID>",
  storageBucket: "<PROJECT_ID>.appspot.com",
  messagingSenderId: "<SENDER_ID>",
  appId: "<APP_ID>"
};
```

## Run

```bash
npx expo start
```

- Scan the QR code in Expo Go.

## Useful Commands

```bash
npx expo start --clear      # clear caches
npm run android             # open Android
npm run ios                 # open iOS (Mac)
```

## Troubleshooting

- If you see "Component auth has not been registered yet":
  - Ensure only `config/firebase.js` initializes Firebase.
  - Delete caches and reinstall:
  ```bash
  rmdir /s node_modules && del package-lock.json
  npm install
  npx expo start --clear
  ```

## Project Structure

```
HotelBookingApp/
  config/firebase.js
  context/AuthContext.js
  screens/
    OnboardingScreen.js
    SignInScreen.js
    SignUpScreen.js
    ForgotPasswordScreen.js
    ExploreScreen.js
    HotelDetailScreen.js
    BookingScreen.js
    BookingSuccessScreen.js
    ProfileScreen.js
    ReviewsScreen.js
  Materials/
  assets/
  App.js
  package.json
```
