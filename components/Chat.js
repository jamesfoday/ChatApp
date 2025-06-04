import React, { useState, useEffect, useCallback } from "react";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";

export default function Chat({ route, navigation, db, isConnected }) {
    const { name, bgColor, userID } = route.params;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, [navigation, name]);

    useEffect(() => {
        let unsubMessages;

        if (isConnected === true) {
            // Listen to Firestore in real-time
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, async (snapshot) => {
                let newMessages = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    newMessages.push({
                        _id: doc.id,
                        ...data,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
                    });
                });
                setMessages(newMessages);

                // Cache to AsyncStorage
                try {
                    await AsyncStorage.setItem('chat_messages', JSON.stringify(newMessages));
                } catch (e) {
                    console.log("Error caching messages: ", e);
                }
            });
        } else {
            // Offline: load messages from cache
            const loadCachedMessages = async () => {
                const cached = await AsyncStorage.getItem('chat_messages');
                if (cached) setMessages(JSON.parse(cached));
            };
            loadCachedMessages();
        }

        return () => {
            if (unsubMessages && typeof unsubMessages === "function") unsubMessages();
        };
    }, [isConnected, db]);

    // Firestore add new message when online only
    const onSend = useCallback((newMessages = []) => {
        if (isConnected) {
            addDoc(collection(db, "messages"), newMessages[0]);
        }
    }, [db, isConnected]);

    // Show/hide input bar based on connection
    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        return null;
    };

    return (
        <View style={{ flex: 1, backgroundColor: bgColor || "#fff" }}>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{
                    _id: userID,
                    name: name,
                }}
                renderInputToolbar={renderInputToolbar}
            // Add other GiftedChat props as needed
            />
            {Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null}
            {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
        </View>
    );
}
