import AsyncStorage from "@react-native-async-storage/async-storage";
import { Paths, File } from "expo-file-system";
import { UserProfile } from "../models/UserProfile";

const STORAGE_KEY = "user_profile";
const PROFILE_IMAGE_PREFIX = "profile_photo";

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
      const oldProfile = await this.getProfile();
      let finalPhotoUri = profile.photoUri;
      const docDirectoryUri = Paths.document.uri;

      // If there's a new photoUri, and it's not already stored in the permanent document directory
      if (profile.photoUri && !profile.photoUri.startsWith(docDirectoryUri)) {
        const fileExtension = profile.photoUri.split(".").pop() || "jpg";
        const newFileName = `${PROFILE_IMAGE_PREFIX}_${Date.now()}.${fileExtension}`;

        const srcFile = new File(profile.photoUri);
        const destFile = new File(Paths.document, newFileName);

        // Copy image from temp/cache location to permanent application directory
        srcFile.copy(destFile);
        finalPhotoUri = destFile.uri;

        // Clean up the old permanent photo if it exists
        if (oldProfile && oldProfile.photoUri && oldProfile.photoUri.startsWith(docDirectoryUri)) {
          try {
            const oldFile = new File(oldProfile.photoUri);
            if (oldFile.exists) {
              oldFile.delete();
            }
          } catch (deleteError) {
            console.error("Failed to delete old profile photo:", deleteError);
          }
        }
      } 
      // If the photo was removed entirely, clean up the old file
      else if (!profile.photoUri && oldProfile && oldProfile.photoUri && oldProfile.photoUri.startsWith(docDirectoryUri)) {
        try {
          const oldFile = new File(oldProfile.photoUri);
          if (oldFile.exists) {
            oldFile.delete();
          }
        } catch (deleteError) {
          console.error("Failed to delete profile photo file on clear:", deleteError);
        }
      }

      const profileToSave: UserProfile = {
        ...profile,
        photoUri: finalPhotoUri,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profileToSave));
      return true;
    } catch (error) {
      console.error("Error saving profile to AsyncStorage:", error);
      return false;
    }
  },

  async deleteProfile(): Promise<boolean> {
    try {
      const currentProfile = await this.getProfile();
      const docDirectoryUri = Paths.document.uri;

    
      if (currentProfile && currentProfile.photoUri && currentProfile.photoUri.startsWith(docDirectoryUri)) {
        try {
          const fileToDelete = new File(currentProfile.photoUri);
          if (fileToDelete.exists) {
            fileToDelete.delete();
          }
        } catch (deleteError) {
          console.error("Failed to delete profile photo file on profile deletion:", deleteError);
        }
      }

      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Error deleting profile from AsyncStorage:", error);
      return false;
    }
  }
};


