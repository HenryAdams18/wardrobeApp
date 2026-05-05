# Smart Digital Wardrobe (Final Year Project)

This project is a React Native mobile application built using Expo. It serves as the practical artifact for my dissertation, featuring a machine-learning-assisted outfit generation engine and a Local-First data architecture.

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Expo Go](https://expo.dev/client) app installed on your physical iOS/Android device, OR an iOS Simulator/Android Emulator set up on your machine.

## How to Run the App

1. **Install Dependencies**
   Open your terminal, navigate to the project directory, and run:
   ```bash
   npm install
   ```

2. **Start the Metro Bundler**
   Once the dependencies have finished installing, start the Expo development server (the `-c` flag clears the cache to ensure a clean build):
   ```bash
   npx expo start -c
   ```

3. **Launch the App**
   - **On a Physical Device:** Open the Expo Go app on your phone and scan the QR code that appears in your terminal.
   - **On an iOS Simulator:** Press `i` in the terminal.
   - **On an Android Emulator:** Press `a` in the terminal.

## Headless Testing & Simulations (Chapter 6 Validation)

This project includes headless simulation scripts built to mathematically validate the outfit generation engine without requiring the React Native UI. These tests prove the efficacy of the multi-factor scoring matrices and the user feedback adaptation loop.

To run the algorithmic validation tests referenced in the Testing & Evaluation chapter of the report, run the following commands in the terminal:

- **Style Profile Validation (Profile A, B, C):**
  ```bash
  node run-simulations.mjs
  ```

- **Adaptation & Learning Loop Validation (Day 1 / Day 2):**
  ```bash
  node run-adaptation.mjs
  ```

- **User Preference Weighting (Monte Carlo Simulation):**
  ```bash
  node frequency-test.mjs
  ```
