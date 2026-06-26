import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import WanderRow from "../../components/home/WanderRow";
import { useFilterStore } from "../../store/useFilterStore";
import { useWanderStore } from "../../store/useWanderStore";
import { Logger } from "../../utils/logger";
import { useProfileViewModel } from "../../viewmodels/useProfileViewModel";

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

const AVATARS_MAP: Record<string, string> = AVATARS.reduce((acc, curr) => {
  acc[curr.id] = curr.icon;
  return acc;
}, {} as Record<string, string>);

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, saveProfile, clearProfile } = useProfileViewModel();

  const destinations = useWanderStore((s) => s.destinations);
  const plans = useWanderStore((s) => s.plans);
  const toggleFavorite = useWanderStore((s) => s.toggleFavorite);

  const savedSpots = destinations.filter((d) => d.isFavorite);
  const savedPlans = plans.filter((p) => p.isFavorite);

  const topSavedSpots = savedSpots.slice(0, 3);

  // Edit Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(profile?.name || "");
  const [editAvatar, setEditAvatar] = useState(profile?.avatar || "person");
  const [editPhotoUri, setEditPhotoUri] = useState<string | null>(profile?.photoUri || null);

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert("Error", "Please enter your name.");
      return;
    }
    await saveProfile(editName, editAvatar, editPhotoUri);
    setIsEditModalVisible(false);
  };

  const setSavedActiveTab = useFilterStore((s) => s.setSavedActiveTab);

  const handleClearProfile = () => {
    Alert.alert(
      "Clear Profile Data",
      "Are you sure you want to completely erase your profile and saved items? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Clear Data",
          style: "destructive",
          onPress: async () => {
            await clearProfile();
            router.replace("/");
          },
        },
      ]
    );
  };

  const launchCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need camera permissions to take a profile picture.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        cameraType: ImagePicker.CameraType.front,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setEditAvatar("camera-photo");
        setEditPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      Logger.error(e);
    }
  };

  const launchLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need photo library permissions to change your avatar.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setEditAvatar("camera-photo");
        setEditPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      Logger.error(e);
    }
  };

  const handlePickImage = () => {
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
      ]
    );
  };

  return (
    <ScreenWrapper bottomPadding={false}>
      {/* HEADER */}
      <View className="py-4 flex-row justify-between items-center">
        <View>
          <Text className="font-bebas text-4xl text-brand-black">PROFILE</Text>
          <Text className="font-montserrat text-xs text-gray-400 mt-0.5 tracking-wider uppercase">
            YOUR PERSONAL TRAVEL LOG
          </Text>
        </View>
        <Pressable
          onPress={() => {
            setEditName(profile?.name || "");
            setEditAvatar(profile?.avatar || "person");
            setEditPhotoUri(profile?.photoUri || null);
            setIsEditModalVisible(true);
          }}
          hitSlop={8}
          className="p-3 rounded-2xl border bg-white border-gray-200 shadow-sm"
        >
          <Ionicons name="create-outline" size={18} color="#1F2937" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* AVATAR & INFO SECTION */}
        <View className="items-center mt-6 mb-8">
          <View className="w-28 h-28 rounded-full border-4 border-brand-green bg-brand-mint items-center justify-center overflow-hidden mb-4 shadow-sm shadow-brand-green/20">
            {profile?.avatar === "camera-photo" && profile.photoUri ? (
              <Image
                source={{ uri: profile.photoUri }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : profile?.avatar && AVATARS_MAP[profile.avatar] ? (
              <Ionicons
                name={AVATARS_MAP[profile.avatar] as any}
                size={50}
                color="#228B22"
              />
            ) : (
              <Ionicons name="person-outline" size={50} color="#228B22" />
            )}
          </View>
          <Text className="font-bebas text-3xl text-brand-black tracking-wide">
            {profile?.name ? profile.name.toUpperCase() : "EXPLORER"}
          </Text>
          <Text className="font-montserrat-bold text-xs text-brand-green uppercase tracking-widest mt-1">
            WanderLanka Traveler
          </Text>
        </View>

        {/* QUICK STATS */}
        <View className="flex-row justify-between gap-4 mb-8">
          <Pressable
            onPress={() => {
              setSavedActiveTab("SPOTS");
              router.push("/(tabs)/saved");
            }}
            className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm items-center active:scale-[0.95]"
            style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
          >
            <View className="w-12 h-12 bg-rose-50 rounded-full items-center justify-center mb-2">
              <Ionicons name="heart" size={24} color="#F43F5E" />
            </View>
            <Text className="font-bebas text-2xl text-brand-black">{savedSpots.length}</Text>
            <Text className="font-montserrat-bold text-[10px] text-gray-400 uppercase tracking-widest mt-1">Saved Spots</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setSavedActiveTab("PLANS");
              router.push("/(tabs)/saved");
            }}
            className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm items-center active:scale-[0.95]"
            style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
          >
            <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-2">
              <Ionicons name="map" size={24} color="#3B82F6" />
            </View>
            <Text className="font-bebas text-2xl text-brand-black">{savedPlans.length}</Text>
            <Text className="font-montserrat-bold text-[10px] text-gray-400 uppercase tracking-widest mt-1">Saved Plans</Text>
          </Pressable>
        </View>

        {/* RECENT FAVORITE SPOTS */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4">
            <Text className="font-bebas text-2xl text-brand-black tracking-wider">
              YOUR FAVORITES
            </Text>
            <Pressable onPress={() => {
              setSavedActiveTab("SPOTS");
              router.push("/(tabs)/saved");
            }} hitSlop={10}>
              <Text className="font-montserrat-bold text-[10px] text-gray-400 uppercase tracking-widest">
                SEE ALL
              </Text>
            </Pressable>
          </View>

          {topSavedSpots.length > 0 ? (
            topSavedSpots.map((spot) => (
              <WanderRow
                key={spot.id}
                id={spot.id}
                type="SPOT"
                title={spot.title}
                imageUri={spot.imageUri}
                rating={spot.rating}
                vibeTag={spot.vibeTag}
                isFavorite={spot.isFavorite}
                distance={spot.distance}
                onToggleFavorite={() => toggleFavorite(spot.id)}
              />
            ))
          ) : (
            <View className="bg-white p-6 rounded-3xl items-center border border-gray-100">
              <Ionicons name="heart-outline" size={28} color="#D1D5DB" />
              <Text className="font-montserrat-bold text-xs text-gray-400 uppercase tracking-widest mt-3 text-center">
                No favorites yet
              </Text>
            </View>
          )}
        </View>

        {/* CLEAR DATA BUTTON */}
        <Pressable
          onPress={handleClearProfile}
          className="bg-red-50 py-4 rounded-2xl items-center justify-center flex-row gap-2 active:scale-[0.98] border border-red-100 mb-8"
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
          <Text className="font-bebas text-lg text-red-500 tracking-wider mt-0.5">CLEAR PROFILE DATA</Text>
        </Pressable>

      </ScrollView>

      {/* EDIT PROFILE MODAL */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setIsEditModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="w-full"
          >
            <Pressable
              className="bg-white rounded-t-[36px] px-6 pt-4 pb-8 w-full shadow-2xl"
              style={{ maxHeight: 600 }}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Drag Handle Indicator */}
              <View className="items-center mb-4">
                <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </View>

              {/* Modal Title Bar */}
              <View className="flex-row justify-between items-center mb-5">
                <View>
                  <Text className="font-bebas text-3xl text-brand-black">EDIT PROFILE</Text>
                  <Text className="font-montserrat-bold text-[10px] text-brand-green tracking-wider uppercase mt-1">
                    UPDATE YOUR DETAILS
                  </Text>
                </View>
                <Pressable
                  onPress={() => setIsEditModalVisible(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                >
                  <Ionicons name="close" size={16} color="#4B5563" />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
                {/* Avatar Preview */}
                <View className="items-center mb-6 mt-2">
                  <View className="w-24 h-24 rounded-full border-4 border-brand-green bg-brand-mint items-center justify-center overflow-hidden mb-2 shadow-sm shadow-brand-green/20">
                    {editAvatar === "camera-photo" && editPhotoUri ? (
                      <Image
                        source={{ uri: editPhotoUri }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    ) : editAvatar && AVATARS_MAP[editAvatar] ? (
                      <Ionicons
                        name={AVATARS_MAP[editAvatar] as any}
                        size={44}
                        color="#228B22"
                      />
                    ) : (
                      <Ionicons name="person-outline" size={44} color="#228B22" />
                    )}
                  </View>
                  <Text className="font-montserrat-bold text-[10px] text-brand-green uppercase tracking-widest">
                    Preview
                  </Text>
                </View>

                {/* Name Input */}
                <View className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm shadow-black/5">
                  <Text className="font-montserrat-bold text-[10px] text-gray-400 uppercase tracking-widest mb-2">Display Name</Text>
                  <TextInput
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Enter your name"
                    className="font-bebas text-2xl text-brand-black"
                    autoCapitalize="words"
                  />
                </View>

                {/* Avatar Selection */}
                <Text className="font-montserrat-bold text-[10px] text-gray-400 uppercase tracking-widest mb-3 ml-2">Choose Avatar</Text>
                <View className="flex-row flex-wrap justify-between gap-y-4 mb-6">
                  {AVATARS.map((item) => {
                    const isSelected = editAvatar === item.id;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => {
                          setEditAvatar(item.id);
                          setEditPhotoUri(null);
                        }}
                        className="w-[30%] items-center"
                      >
                        <View
                          className={`w-16 h-16 rounded-full border-2 items-center justify-center mb-2 ${isSelected ? "border-brand-green bg-brand-mint" : "border-gray-200 bg-white"
                            }`}
                        >
                          <Ionicons
                            name={item.icon as any}
                            size={28}
                            color={isSelected ? "#228B22" : "#9CA3AF"}
                          />
                        </View>
                        <Text
                          className={`font-montserrat-bold text-[10px] uppercase tracking-wider ${isSelected ? "text-brand-green" : "text-gray-400"
                            }`}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Image Picker Button */}
                <Pressable
                  onPress={handlePickImage}
                  className={`w-full flex-row items-center justify-center bg-white border border-gray-200/80 py-4 px-6 rounded-2xl mb-6 ${editAvatar === "camera-photo" ? "border-brand-green bg-brand-green/5" : ""
                    } active:scale-[0.98]`}
                >
                  <Ionicons
                    name={editAvatar === "camera-photo" ? "checkmark-circle" : "camera-outline"}
                    size={22}
                    color={editAvatar === "camera-photo" ? "#228B22" : "#000000"}
                  />
                  <Text className="font-montserrat-bold text-xs text-brand-black uppercase tracking-widest ml-2">
                    {editAvatar === "camera-photo" ? "Custom Photo Selected" : "Upload Custom Photo"}
                  </Text>
                </Pressable>

              </ScrollView>

              {/* Footer Action Button */}
              <View className="border-t border-gray-100 pt-4">
                <Pressable
                  onPress={handleSaveProfile}
                  className="bg-brand-black py-4 rounded-2xl items-center justify-center active:scale-[0.98]"
                >
                  <Text className="font-bebas text-xl text-white tracking-wider">SAVE CHANGES</Text>
                </Pressable>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

    </ScreenWrapper>
  );
}
