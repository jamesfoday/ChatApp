import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './components/Start';
import Chat from './components/Chat';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted, EventEmitter.removeListener"]);


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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}