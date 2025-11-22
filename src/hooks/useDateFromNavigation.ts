import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { parseDateFromNavigation } from '../utils/timeHelpers';

/**
 * Custom hook to extract and manage date from navigation state
 * @returns Object with selectedDate and setSelectedDate
 */
export const useDateFromNavigation = () => {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (location.state?.selectedDate) {
      const parsedDate = parseDateFromNavigation(location.state.selectedDate);
      setSelectedDate(parsedDate);
    }
  }, [location.state]);

  return { selectedDate, setSelectedDate };
};

