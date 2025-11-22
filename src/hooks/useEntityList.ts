import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { parseDateFromNavigation } from '../utils/timeHelpers';

interface UseEntityListOptions<T> {
  loadEntities: (userId: string, date: Date) => Promise<T[]>;
  entityName: string;
}

/**
 * Custom hook for managing entity list pages
 * Handles loading, date management, and refresh logic
 */
export const useEntityList = <T,>({
  loadEntities,
  entityName,
}: UseEntityListOptions<T>) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const processedLocationRef = useRef<string | null>(null);

  const loadItems = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const entitiesData = await loadEntities(currentUser.uid, selectedDate);
      setItems(entitiesData);
    } catch (error: any) {
      setError(`Failed to load ${entityName}`);
      console.error(`Error loading ${entityName}:`, error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, selectedDate, loadEntities, entityName]);

  useEffect(() => {
    const locationKey = location.key || 'default';

    // Only process if this is a new location
    if (processedLocationRef.current !== locationKey) {
      processedLocationRef.current = locationKey;

      // If refresh flag is present, reset to today's date
      if (location.state?.refresh) {
        setSelectedDate(new Date());
        if (currentUser) {
          setTimeout(() => {
            loadItems();
          }, 100);
        }
      } else if (location.state?.selectedDate) {
        // Get selected date from navigation state if available
        const parsedDate = parseDateFromNavigation(location.state.selectedDate);
        setSelectedDate(parsedDate);
      } else {
        // If no date in navigation state, ensure we're using today's date
        setSelectedDate(new Date());
      }
    }
  }, [location, currentUser, loadItems]);

  useEffect(() => {
    if (currentUser) {
      loadItems();
    }
  }, [currentUser, selectedDate, loadItems]);

  const refresh = useCallback(() => {
    loadItems();
  }, [loadItems]);

  return {
    items,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    loadItems,
    refresh,
  };
};

