import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';

// Firebase Auth imports:
import { getAuth, signInAnonymously } from "firebase/auth";

// List of background color options
const backgroundColors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

export default function Start({ navigation }) {
    // State for user name and selected color
    const [name, setName] = useState('');
    const [bgColor, setBgColor] = useState(backgroundColors[0]);

    // Handle Anonymous Auth and navigate
    const signInUser = () => {
        const auth = getAuth();
        signInAnonymously(auth)
            .then(result => {
                navigation.navigate('Chat', {
                    userID: result.user.uid,
                    name: name || "Anonymous",
                    bgColor
                });
            })
            .catch(() => {
                Alert.alert("Unable to sign in, try again.");
            });
    };

    return (
        <ImageBackground
            source={require('../assets/background-image.png')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Chat App</Text>

                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Your Name"
                        placeholderTextColor="#757083"
                        accessible={true}
                        accessibilityLabel="Name input"
                        accessibilityHint="Enter your name here"
                    />
                </View>

                <Text style={styles.colorText}>Choose Background Color:</Text>
                <View style={styles.colorPicker}>
                    {backgroundColors.map((color, idx) => (
                        <TouchableOpacity
                            key={color}
                            style={[
                                styles.colorCircle,
                                { backgroundColor: color },
                                bgColor === color && styles.selectedCircle,
                            ]}
                            onPress={() => setBgColor(color)}
                            accessible={true}
                            accessibilityLabel={`Color option ${idx + 1}`}
                            accessibilityHint={`Sets the chat background color to ${color}`}
                            accessibilityRole="button"
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={signInUser}
                    accessible={true}
                    accessibilityLabel="Start chatting"
                    accessibilityHint="Navigates to the chat screen"
                    accessibilityRole="button"
                >
                    <Text style={styles.buttonText}>Start Chatting</Text>
                </TouchableOpacity>
            </View>

            {/* Keyboard avoiding for Android to prevent input from being hidden */}
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 45,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 60,
        marginTop: 50,
    },
    inputBox: {
        backgroundColor: '#fff',
        borderRadius: 5,
        width: '90%',
        padding: 10,
        marginBottom: 25,
    },
    input: {
        height: 40,
        fontSize: 16,
        color: '#757083',
    },
    colorText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
    },
    colorPicker: {
        flexDirection: 'row',
        marginBottom: 30,
        justifyContent: 'center',
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedCircle: {
        borderColor: '#fff',
        borderWidth: 3,
    },
    button: {
        backgroundColor: '#757083',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});