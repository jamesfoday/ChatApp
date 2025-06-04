// App.js
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Alert, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { useNetInfo } from "@react-native-community/netinfo";
import { initializeApp } from 'firebase/app';

// Your screens
import Start from './components/Start';
import Chat from './components/Chat';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB70lo-Ee5zxTcydEjLgfFPgCNNOkHJqXc",
  authDomain: "chatt-3e031.firebaseapp.com",
  projectId: "chatt-3e031",
  storageBucket: "chatt-3e031.firebasestorage.app",
  messagingSenderId: "38071780629",
  appId: "1:38071780629:web:302309e1df934c7122551c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native core',

]);

export default function App() {
  // Detect network status
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {props => (
            <Chat
              db={db}
              isConnected={connectionStatus.isConnected}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


