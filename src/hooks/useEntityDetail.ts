import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UseEntityDetailOptions<T> {
  loadEntity: (userId: string, id: string) => Promise<T | null>;
  entityName: string;
}

/**
 * Custom hook for managing entity detail pages
 * Handles loading, error states, and deletion
 */
export const useEntityDetail = <T,>({
  loadEntity,
  entityName,
}: UseEntityDetailOptions<T>) => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [entity, setEntity] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(async () => {
    if (!currentUser || !id) return;

    setLoading(true);
    setError(null);

    try {
      const entityData = await loadEntity(currentUser.uid, id);
      if (entityData) {
        setEntity(entityData);
      } else {
        setError(`${entityName} not found`);
      }
    } catch (error: any) {
      setError(`Failed to load ${entityName}`);
      console.error(`Error loading ${entityName}:`, error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, id, loadEntity, entityName]);

  useEffect(() => {
    if (currentUser && id) {
      reload();
    }
  }, [currentUser, id, reload]);

  return {
    entity,
    loading,
    error,
    deleting,
    setDeleting,
    setError,
    reload,
  };
};

