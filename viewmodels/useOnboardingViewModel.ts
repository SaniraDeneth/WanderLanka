import { useState } from "react";
import { Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useProfileViewModel } from "./useProfileViewModel";

export function useOnboardingViewModel() {
  const router = useRouter();
  const { saveProfile } = useProfileViewModel();

  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleNextStep = () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter your name to continue.");
      return;
    }
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const requestPermissionAndPick = async (
    requestPermission: () => Promise<ImagePicker.PermissionResponse>,
    launchPicker: () => Promise<ImagePicker.ImagePickerResult>,
    permissionType: "camera" | "photo library"
  ) => {
    try {
      const { status } = await requestPermission();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          `WanderLanka needs ${permissionType} permissions to choose a profile picture. Please enable it in settings.`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }

      const result = await launchPicker();
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedAvatar("camera-photo");
        setPhotoUri(result.assets[0].uri);
        Alert.alert("Success", "Profile photo successfully updated!");
      }
    } catch (error) {
      console.error(`Error selecting photo via ${permissionType}:`, error);
      Alert.alert("Error", `Could not access ${permissionType}. Please try again.`);
    }
  };

  const launchCamera = () => {
    requestPermissionAndPick(
      ImagePicker.requestCameraPermissionsAsync,
      () => ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        cameraType: ImagePicker.CameraType.front,
      }),
      "camera"
    );
  };

  const launchLibrary = () => {
    requestPermissionAndPick(
      ImagePicker.requestMediaLibraryPermissionsAsync,
      () => ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      }),
      "photo library"
    );
  };

  const handleTakePhoto = () => {
    Alert.alert(
      "Profile Photo",
      "Select a source for your photo:",
      [
        {
          text: "Take Photo",
          onPress: launchCamera,
        },
        {
          text: "Choose from Library",
          onPress: launchLibrary,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  // Finish Setup
  const handleFinishSetup = async () => {
    if (!selectedAvatar) {
      Alert.alert("Required", "Please select a badge or capture a photo.");
      return;
    }

    setIsSaving(true);
    try {
      const success = await saveProfile(name, selectedAvatar, photoUri);
      setIsSaving(false);

      if (success) {
        router.replace("/home");
      } else {
        Alert.alert("Error", "Could not complete onboarding. Please try again.");
      }
    } catch (error) {
      console.error("Error saving profile details:", error);
      setIsSaving(false);
      Alert.alert("Error", "Could not complete onboarding. Please try again.");
    }
  };

  return {
    step,
    name,
    setName,
    selectedAvatar,
    setSelectedAvatar,
    photoUri,
    setPhotoUri,
    isSaving,
    handleNextStep,
    handleBackStep,
    handleTakePhoto,
    handleFinishSetup,
  };
}
