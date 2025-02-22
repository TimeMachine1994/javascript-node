import type { UserMetadata, WPUserData } from '$lib/types/user-metadata';

class UserState {
  userData = $state<UserMetadata[]>([]);
  wpUserData = $state<WPUserData | undefined>(undefined);
  isLoggedIn = $derived(!!this.wpUserData);
  isAdmin = $derived(this.wpUserData?.roles?.includes('administrator') ?? false);
  userDisplayName = $derived(this.wpUserData?.displayName ?? '');

  setUserData(userData: UserMetadata[]) {
    this.userData = userData;
  }

  setWPUserData(wpUserData?: WPUserData) {
    this.wpUserData = wpUserData;
  }
}

// Export a singleton instance
export const userState = new UserState();