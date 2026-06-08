import { useProfileStore } from "../store/useProfileStore";

export function useProfileViewModel() {
  const { profile, loading, loadProfile, saveProfile, clearProfile } = useProfileStore();

  return {
    profile,
    loading,
    saveProfile,
    clearProfile,
    reloadProfile: loadProfile,
  };
}
