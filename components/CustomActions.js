import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, storage, userID, onSend }) => {
    const actionSheet = useActionSheet();

    // Helper to generate a unique Firebase Storage reference string
    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/").pop();
        return `${userID}-${timeStamp}-${imageName}`;
    };

    // Uploads an image to Firebase Storage and sends the image as a message
    const uploadAndSendImage = async (imageURI) => {
        try {
            console.log("Uploading image from URI:", imageURI);
            const uniqueRefString = generateReference(imageURI);
            const newUploadRef = ref(storage, uniqueRefString);

            const response = await fetch(imageURI);
            const blob = await response.blob();
            console.log("Blob size:", blob.size);

            const snapshot = await uploadBytes(newUploadRef, blob);
            const imageURL = await getDownloadURL(snapshot.ref);
            onSend([{ image: imageURL }]);
            console.log("Image sent! URL:", imageURL);
        } catch (error) {
            console.error("Upload failed:", error);
            Alert.alert("Error", "Could not upload image: " + error.message);
        }
    };

    // Pick image from library
    const pickImage = async () => {
        try {
            let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissions.granted) {
                Alert.alert("Permission denied for image library.");
                return;
            }
            let result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {
                await uploadAndSendImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Error", "Could not pick image.");
            console.error("pickImage error:", error);
        }
    };

    // Take a photo with the camera
    const takePhoto = async () => {
        try {
            let permissions = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissions.granted) {
                Alert.alert("Permission denied for camera.");
                return;
            }
            let result = await ImagePicker.launchCameraAsync();
            if (!result.canceled) {
                await uploadAndSendImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Error", "Could not take photo.");
            console.error("takePhoto error:", error);
        }
    };

    // Get current device location and send as a message
    const getLocation = async () => {
        try {
            let permissions = await Location.requestForegroundPermissionsAsync();
            if (!permissions.granted) {
                Alert.alert("Permission denied for location.");
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                onSend([{
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    }
                }]);
                console.log("Location sent:", location.coords);
            }
        } catch (error) {
            Alert.alert("Error", "Could not get location.");
            console.error("getLocation error:", error);
        }
    };

    // Show ActionSheet menu and handle selection
    const onActionPress = () => {
        const options = [
            "Select an image from library",
            "Take a photo",
            "Share location",
            "Cancel"
        ];
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        break;
                    case 1:
                        takePhoto();
                        break;
                    case 2:
                        getLocation();
                        break;
                }
            }
        );
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onActionPress}
            accessible={true}
            accessibilityLabel="More actions"
            accessibilityHint="Opens menu to send images or your location"
            accessibilityRole="button"
        >
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: "#b2b2b2",
        borderWidth: 2,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    iconText: {
        color: "#b2b2b2",
        fontWeight: "bold",
        fontSize: 16,
        backgroundColor: "transparent",
        textAlign: "center",
    },
});

export default CustomActions;
