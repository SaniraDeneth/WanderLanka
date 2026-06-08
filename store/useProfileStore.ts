import { create } from "zustand";
import { UserProfile } from "../models/UserProfile";
import { profileService } from "../services/profileService";

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  loadProfile: () => Promise<void>;
  saveProfile: (name: string, avatar: string, photoUri: string | null) => Promise<boolean>;
  clearProfile: () => Promise<boolean>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: true,

  loadProfile: async () => {
    set({ loading: true });
    const data = await profileService.getProfile();
    set({ profile: data, loading: false });
  },

  saveProfile: async (name: string, avatar: string, photoUri: string | null) => {
    const newProfile: UserProfile = {
      name: name.trim(),
      avatar,
      photoUri,
      onboarded: true,
    };

    const success = await profileService.saveProfile(newProfile);
    if (success) {
      set({ profile: newProfile });
    }
    return success;
  },

  clearProfile: async () => {
    const success = await profileService.deleteProfile();
    if (success) {
      set({ profile: null });
    }
    return success;
  },
}));
