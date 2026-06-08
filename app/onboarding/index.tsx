import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../../components/Button";
import ScreenWrapper from "../../components/ScreenWrapper";

const AVATARS = [
  { id: "person", icon: "person-outline", label: "Traveler" },
  { id: "compass", icon: "compass-outline", label: "Explorer" },
  { id: "camera", icon: "camera-outline", label: "Shutterbug" },
  { id: "map", icon: "map-outline", label: "Backpacker" },
  { id: "globe", icon: "globe-outline", label: "Nomad" },
  { id: "airplane", icon: "airplane-outline", label: "Flyer" },
  { id: "bicycle", icon: "bicycle-outline", label: "Cyclist" },
  { id: "boat", icon: "boat-outline", label: "Sailor" },
  { id: "umbrella", icon: "umbrella-outline", label: "Vacationer" },
];

export default function OnboardingScreen() {
  const router = useRouter();

  // Onboarding Steps State
  const [step, setStep] = useState<1 | 2>(1);

  // Profile Data State
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  // Transitions
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

  // Photo Source Selection Alert
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

  const launchCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "WanderLanka needs camera permissions to take a profile picture. Please enable it in settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        cameraType: ImagePicker.CameraType.front,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedAvatar("camera-photo");
        setPhotoUri(result.assets[0].uri);
        Alert.alert("Success", "Profile photo successfully updated!");
      }
    } catch (error) {
      console.error("Error launching camera:", error);
      Alert.alert("Error", "Could not launch camera. Please try again.");
    }
  };

  const launchLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "WanderLanka needs photo library permissions to select a profile picture. Please enable it in settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedAvatar("camera-photo");
        setPhotoUri(result.assets[0].uri);
        Alert.alert("Success", "Profile photo successfully updated!");
      }
    } catch (error) {
      console.error("Error launching library:", error);
      Alert.alert("Error", "Could not open photo library. Please try again.");
    }
  };

  // Finish Onboarding Setup
  const handleFinishSetup = async () => {
    if (!selectedAvatar) {
      Alert.alert("Required", "Please select a badge or capture a photo.");
      return;
    }

    setIsSaving(true);
    try {
      const profileData = {
        name: name.trim(),
        avatar: selectedAvatar,
        photoUri: photoUri,
        onboarded: true,
      };

      await AsyncStorage.setItem("user_profile", JSON.stringify(profileData));
      console.log("Onboarding Saved Data:", profileData);

      setIsSaving(false);

      // Navigate to home dashboard
      router.replace("/home");
    } catch (error) {
      console.error("Error saving profile details:", error);
      setIsSaving(false);
      Alert.alert("Error", "Could not complete onboarding. Please try again.");
    }
  };

  return (
    <ScreenWrapper showGradients={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          {/* Header Bar */}
          <View className="flex-row items-center justify-between mt-4 mb-2">
            {step === 2 ? (
              <Pressable
                onPress={handleBackStep}
                className="w-10 h-10 bg-white border border-gray-100 rounded-full items-center justify-center active:scale-[0.95] shadow-sm"
              >
                <Ionicons name="chevron-back" size={20} color="#000000" />
              </Pressable>
            ) : (
              <View className="w-10 h-10" />
            )}
            <Text className="font-bebas text-2xl tracking-widest text-brand-black">
              WANDER<Text className="text-brand-green">LANKA</Text>
            </Text>
            <View className="w-10 h-10" />
          </View>

          {/* Progress Indicator */}
          <View className="w-full flex-row items-center justify-between mb-8 mt-2 px-1">
            <View className="flex-1 h-1.5 bg-gray-200 rounded-full mr-4 overflow-hidden">
              <View
                className="h-full bg-brand-green rounded-full"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </View>
            <Text className="font-montserrat-bold text-[10px] text-gray-500 uppercase tracking-widest">
              Step {step} of 2
            </Text>
          </View>

          {/* Conditional Steps Render */}
          {step === 1 ? (
            /* STEP 1: Name Input Screen */
            <View className="flex-1 justify-between">
              <View>
                <Text className="font-bebas text-5xl text-brand-black tracking-wide leading-tight">
                  TELL US YOUR NAME
                </Text>
                <Text className="font-montserrat text-sm text-gray-500 mt-2 leading-relaxed">
                  Start your journey by telling us what to call you. This helps us customize your tours, destinations, and recommendations.
                </Text>

                {/* Styled Card Input */}
                <View className="bg-white rounded-2xl p-6 shadow-md shadow-black/5 border border-gray-100/50 mt-10">
                  <Text className="font-montserrat-bold text-xs text-gray-400 uppercase tracking-widest mb-2">
                    Enter Name
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. John Doe"
                    placeholderTextColor="#A3A3A3"
                    className="text-lg font-montserrat text-brand-black py-2 border-b border-gray-100"
                    maxLength={30}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View className="mt-8 mb-4">
                <Button
                  title="CONTINUE"
                  onPress={handleNextStep}
                  disabled={!name.trim()}
                />
              </View>
            </View>
          ) : (
            /* STEP 2: Profile Picture Selection Grid */
            <View className="flex-1 justify-between">
              <View>
                <Text className="font-bebas text-5xl text-brand-black tracking-wide leading-tight">
                  CHOOSE A PROFILE PICTURE
                </Text>
                <Text className="font-montserrat text-sm text-gray-500 mt-2 leading-relaxed">
                  Select a custom traveler badge below or take a live picture to style your travel pass.
                </Text>

                {/* 3x3 Grid of Placeholders */}
                <View className="flex-row flex-wrap justify-between mt-8 mb-4 will-change-variable">
                  {AVATARS.map((avatar) => {
                    const isSelected = selectedAvatar === avatar.id;
                    return (
                      <Pressable
                        key={avatar.id}
                        onPress={() => {
                          setSelectedAvatar(avatar.id);
                          setPhotoUri(null);
                        }}
                        className={`w-[30%] aspect-square rounded-2xl bg-white items-center justify-center mb-4 shadow-sm border-2 ${isSelected ? "border-brand-green bg-brand-green/5" : "border-gray-100/50"
                          } active:scale-[0.95]`}
                      >
                        <Ionicons
                          name={avatar.icon as any}
                          size={32}
                          color={isSelected ? "#A8D030" : "#4B5563"}
                        />
                        <Text
                          className={`font-montserrat text-[10px] mt-1 text-center uppercase tracking-widest ${isSelected ? "font-montserrat-bold text-brand-green" : "text-gray-500"
                            }`}
                        >
                          {avatar.label}
                        </Text>
                        {isSelected && (
                          <View className="absolute top-1.5 right-1.5 bg-brand-green w-4.5 h-4.5 rounded-full items-center justify-center">
                            <Ionicons name="checkmark" size={12} color="#000000" />
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>

                {/* Take Photo Button */}
                <Pressable
                  onPress={handleTakePhoto}
                  className={`w-full flex-row items-center justify-center bg-white border border-gray-200/80 py-4 px-6 rounded-2xl shadow-sm mb-6 ${selectedAvatar === "camera-photo" ? "border-brand-green bg-brand-green/5" : ""
                    } active:scale-[0.98]`}
                >
                  <Ionicons
                    name={selectedAvatar === "camera-photo" ? "checkmark-circle" : "camera-outline"}
                    size={22}
                    color={selectedAvatar === "camera-photo" ? "#A8D030" : "#000000"}
                  />
                  <Text className="font-montserrat-bold text-xs text-brand-black uppercase tracking-widest ml-2">
                    {selectedAvatar === "camera-photo" ? "Custom Photo Selected" : "Take Photo"}
                  </Text>
                </Pressable>
              </View>

              <View className="mb-4">
                {isSaving ? (
                  <View className="py-4 items-center justify-center">
                    <ActivityIndicator size="large" color="#000000" />
                  </View>
                ) : (
                  <Button
                    title="FINISH SETUP"
                    onPress={handleFinishSetup}
                    disabled={!selectedAvatar}
                  />
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
