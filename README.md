# WanderLanka 🇱🇰

WanderLanka is a premium, localized travel companion application built to help users explore the most beautiful destinations and travel plans across Sri Lanka. It features offline database persistence, live GPS location tracking, responsive design layouts, dynamic search filtering, and custom traveler profile badges.

---

## 🚀 Technology Stack & Frameworks

*   **Core Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54)
*   **Routing & Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
*   **Styling:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
*   **Database:** [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) (High-performance offline storage and seeding)
*   **Location Services:** [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) (Live GPS tracking and Colombo fallback)
*   **Asset Handling:** [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) & [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/image-picker/)

---

## 🛠️ System Dependencies

Before you begin, ensure you have the following installed on your machine:

1.  **Node.js:** v18.0.0 or higher
2.  **Package Manager:** [Bun](https://bun.sh/) (Recommended) or `npm`
3.  **Expo CLI:** Installed globally or run via local bundlers (`npx expo`)
4.  **Emulators/Simulators:**
    *   **iOS:** [Xcode](https://developer.apple.com/xcode/) (macOS only) with iOS Simulator
    *   **Android:** [Android Studio](https://developer.android.com/) with an active Android Virtual Device (AVD)
5.  **Physical Device Testing:** Install the **Expo Go** application from the iOS App Store or Android Play Store.

---

## 💻 Getting Started

Follow these steps to run the application locally:

### 1. Clone & Navigate
```bash
git clone https://github.com/SaniraDeneth/WanderLanka
cd WanderLanka
```

### 2. Install Dependencies
Using Bun (recommended):
```bash
bun install
```
Or using npm:
```bash
npm install
```

### 3. Start the Development Server
```bash
bun start
# or npm start
```

### 4. Launching the App
In the terminal, use the interactive shortcuts to run the app:
*   Press **`i`** to open the **iOS Simulator**.
*   Press **`a`** to open the **Android Emulator**.
*   Scan the displayed **QR Code** using your phone's camera (iOS) or the Expo Go App (Android) to run it on a physical device.

---

## 🗺️ Key Features & Layouts

*   **Interactive Maps:** Visualizes Sri Lankan destinations using native maps. Includes card views with directions and details.
*   **Search & Dynamic Filters:** Instantly search through 97+ spots or plans, filter by Vibe (Nature, Adventure, Culture, Relax, Luxury), Category, budget, distance, or ratings.
*   **Smart Location Services:** Sorts destinations by distance relative to your current location (updates efficiently to avoid battery drain).
*   **Interactive Pull-to-Clear:** Easily wipe active search filters on the Explore screen with an interactive swipe-down gesture.
*   **Traveler Profiles:** Customize names, select unique explorer badges, upload custom profile pictures, save favorites, and clear data to reset.
*   **Offline First:** Pre-seeded with 97 Sri Lankan landmarks that load instantly from an offline SQLite database. Clearing profile data wipes and re-seeds the database for a fresh start.
