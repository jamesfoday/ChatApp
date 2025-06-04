import React, { useState, useEffect, useCallback } from "react";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";

export default function Chat({ route, navigation, db, storage, isConnected }) {
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
        // For immediate UI feedback (adds locally, then syncs if online)
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    }, [db, isConnected]);

    // Show/hide input bar based on connection
    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        return null;
    };

    // [NEW] Show "+" button (with all features)
    const renderCustomActions = (props) => (
        <CustomActions
            storage={storage}
            userID={userID}
            onSend={onSend}
            {...props}
        />
    );

    // Render a map in chat bubble if the message has location data
    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3,
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                />
            );
        }
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
                renderActions={renderCustomActions}   // Add actions menu
                renderCustomView={renderCustomView}   // Add custom map bubble
            />
            {Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null}
            {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
        </View>
    );
}
