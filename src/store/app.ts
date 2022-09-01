import { Profile } from '@generated/types';
import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { mountStoreDevtool } from 'simple-zustand-devtools';

interface AppState {
  profiles: Profile[] | [];
  setProfiles: (profiles: Profile[]) => void;
  currentProfile: Profile | null;
  setCurrentProfile: (currentProfile: Profile | null) => void;
  userSigNonce: number;
  setUserSigNonce: (userSigNonce: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  profiles: [],
  setProfiles: (profiles) => set(() => ({ profiles })),
  currentProfile: null,
  setCurrentProfile: (currentProfile) => set(() => ({ currentProfile })),
  userSigNonce: 0,
  setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce })),
}));

interface AppPersistState {
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  profileId: string | null;
  setProfileId: (profileId: string | null) => void;
  currentUser: Profile | null;
  setCurrentUser: (currentUser: Profile | null) => void;
}

export const useAppPersistStore = create(
  persist<AppPersistState>(
    (set) => ({
      isConnected: false,
      setIsConnected: (isConnected) => set(() => ({ isConnected })),
      isAuthenticated: false,
      setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
      profileId: null,
      setProfileId: (profileId) => set(() => ({ profileId })),
      currentUser: null,
      setCurrentUser: (currentUser) => set(() => ({ currentUser })),
    }),
    { name: 'acroama.store' }
  )
);

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useAppStore);
}
