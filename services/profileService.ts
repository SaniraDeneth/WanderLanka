import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "../models/UserProfile";

const STORAGE_KEY = "user_profile";

export const profileService = {
  async getProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading profile from AsyncStorage:", error);
      return null;
    }
  },

  async saveProfile(profile: UserProfile): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error("Error saving profile to AsyncStorage:", error);
      return false;
    }
  },

  async deleteProfile(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Error deleting profile from AsyncStorage:", error);
      return false;
    }
  }
};
