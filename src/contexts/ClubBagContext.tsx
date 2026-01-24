import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_CLUBS } from '@/src/features/settings/utils/club-mapping';

export interface Club {
  key: string;
  name: string;
  isEnabled: boolean;
  customDistance: number;
  sortOrder: number;
}

interface ClubBagContextType {
  clubs: Club[];
  updateClub: (clubKey: string, updates: Partial<Club>) => Promise<void>;
  getEnabledClubs: () => Club[];
  getRecommendedClub: (yardage: number) => Club | null;
  isLoading: boolean;
}

const STORAGE_KEY = 'club_bag';

const ClubBagContext = React.createContext<ClubBagContextType | null>(null);

function getDefaultClubs(): Club[] {
  return DEFAULT_CLUBS.map((club, index) => ({
    key: club.key,
    name: club.name,
    isEnabled: true,
    customDistance: club.defaultDistance,
    sortOrder: index,
  }));
}

export function ClubBagProvider({ children }: { children: React.ReactNode }) {
  const [clubs, setClubs] = React.useState<Club[]>(getDefaultClubs());
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClubs(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load clubs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateClub = async (clubKey: string, updates: Partial<Club>) => {
    try {
      const newClubs = clubs.map(club =>
        club.key === clubKey ? { ...club, ...updates } : club
      );
      setClubs(newClubs);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newClubs));
    } catch (error) {
      console.error('Failed to save club:', error);
    }
  };

  const getEnabledClubs = React.useCallback(() => {
    return clubs
      .filter(club => club.isEnabled)
      .sort((a, b) => b.customDistance - a.customDistance);
  }, [clubs]);

  const getRecommendedClub = React.useCallback((yardage: number): Club | null => {
    const enabled = getEnabledClubs();
    if (enabled.length === 0) return null;

    let bestClub = enabled[enabled.length - 1];
    for (const club of enabled) {
      if (club.customDistance >= yardage) {
        bestClub = club;
      } else {
        break;
      }
    }
    return bestClub;
  }, [getEnabledClubs]);

  const value = React.useMemo(() => ({
    clubs,
    updateClub,
    getEnabledClubs,
    getRecommendedClub,
    isLoading,
  }), [clubs, isLoading, getEnabledClubs, getRecommendedClub]);

  return (
    <ClubBagContext.Provider value={value}>
      {children}
    </ClubBagContext.Provider>
  );
}

export function useClubBag() {
  const context = React.useContext(ClubBagContext);
  if (!context) {
    throw new Error('useClubBag must be used within ClubBagProvider');
  }
  return context;
}
