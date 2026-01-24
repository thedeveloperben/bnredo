import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

export function useCompassHeading() {
  const [heading, setHeading] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function setupCompass() {
      if (Platform.OS === 'web') {
        setHeading(0);
        setHasPermission(false);
        return;
      }

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setHasPermission(false);
          return;
        }

        setHasPermission(true);

        subscription = await Location.watchHeadingAsync((headingData) => {
          setHeading(headingData.trueHeading);
        });
      } catch (error) {
        console.error('Error setting up compass:', error);
        setHasPermission(false);
      }
    }

    setupCompass();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { heading, hasPermission };
}
