# React Native Chat App

A cross-platform chat application built with React Native, Expo, Firebase Firestore, and Firebase Storage. Users can send and receive text messages, share images (from their device or camera), and share their current location in real-time.

---

## Features

- **Real-time messaging** (Firebase Firestore)
- **Send and receive images** (from library or camera, stored in Firebase Storage)
- **Share current location** (renders an in-message map)
- **Offline support** (read cached messages when offline)
- **Modern chat UI** (using [react-native-gifted-chat](https://github.com/FaridSafi/react-native-gifted-chat))
- **Cross-platform** (Android/iOS, tested on device & emulator)
- **Accessibility** (accessible actions, focusable controls)

---

## Screenshots

*(Insert screenshots/gif of the chat screen, sending images, sending location, etc.)*

---

## Tech Stack

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Firebase Firestore](https://firebase.google.com/products/firestore)
- [Firebase Storage](https://firebase.google.com/products/storage)
- [react-native-gifted-chat](https://github.com/FaridSafi/react-native-gifted-chat)
- [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/)
- [@expo/react-native-action-sheet](https://docs.expo.dev/versions/latest/sdk/actionsheet/)

---

## Setup Instructions

### 1. **Clone the Repository**

```sh
git clone https://github.com/jamesfoday/ChatApp.git
cd <your-repo>
