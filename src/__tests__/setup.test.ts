/**
 * Basic test to verify Jest setup is working
 */

describe('Jest Setup', () => {
  it('should run tests', () => {
    expect(true).toBe(true);
  });

  it('should have access to mocked AsyncStorage', () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    expect(AsyncStorage).toBeDefined();
    expect(AsyncStorage.setItem).toBeDefined();
    expect(AsyncStorage.getItem).toBeDefined();
  });

  it('should have access to mocked expo-location', () => {
    const Location = require('expo-location');
    expect(Location.requestForegroundPermissionsAsync).toBeDefined();
    expect(Location.getCurrentPositionAsync).toBeDefined();
    expect(Location.Accuracy).toBeDefined();
  });

  it('should have access to mocked expo-haptics', () => {
    const Haptics = require('expo-haptics');
    expect(Haptics.impactAsync).toBeDefined();
    expect(Haptics.ImpactFeedbackStyle).toBeDefined();
  });
});
