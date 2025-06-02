import React, { useState, useCallback, useEffect } from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    addDoc
} from 'firebase/firestore';

export default function Chat({ route, db, navigation }) {
    // Receive user info and background color
    const { userID, name, bgColor } = route.params || {};

    const [messages, setMessages] = useState([]);

    // Set screen title to user's name
    useEffect(() => {
        navigation.setOptions({ title: name || "Chat" });
    }, [name]);

    // Real-time Firestore listener
    useEffect(() => {
        // Query to sort by createdAt DESC
        const messagesQuery = query(
            collection(db, 'messages'),
            orderBy('createdAt', 'desc')
        );
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const newMessages = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                newMessages.push({
                    _id: doc.id,
                    text: data.text,
                    createdAt: data.createdAt?.toDate
                        ? data.createdAt.toDate()
                        : new Date(), // fallback for missing date
                    user: data.user,
                });
            });
            setMessages(newMessages);
        });
        // Cleanup listener on unmount
        return () => unsubscribe && unsubscribe();
    }, []);

    // Send message to Firestore
    const onSend = useCallback((newMessages = []) => {
        if (newMessages.length > 0) {
            // Add to Firestore (GiftedChat creates the correct object)
            addDoc(collection(db, 'messages'), {
                ...newMessages[0],
                // Firestore requires a JS Date or Timestamp object for sorting
                createdAt: new Date(),
            });
        }
    }, [db]);

    return (
        <View style={[styles.container, { backgroundColor: bgColor || '#fff' }]}>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{
                    _id: userID,
                    name: name || 'User',
                }}
                renderUsernameOnMessage={true}
                showUserAvatar={true}
                showAvatarForEveryMessage={false}
                placeholder="Type your message..."
            />
            {Platform.OS === 'android' ? (
                <KeyboardAvoidingView behavior="height" />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});