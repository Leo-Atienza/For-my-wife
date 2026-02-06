import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

export const zustandStorage = createJSONStorage(() => AsyncStorage);

export const clearAllData = async (): Promise<void> => {
  await AsyncStorage.clear();
};
