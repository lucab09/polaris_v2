import React, { useEffect } from 'react';
import { RootNavigator } from '@navigation/RootNavigator';
import { useUserStore } from '@store/userStore';
import { storageService } from '@services/storage';

export default function App(): React.JSX.Element {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize storage
      await storageService.initialize();

      // Initialize user store
      const userStore = useUserStore.getState();
      await userStore.initializeUser();
    } catch (error) {
      console.error('App initialization error:', error);
    }
  };

  return <RootNavigator />;
}
