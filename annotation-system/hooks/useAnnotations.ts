import { useState, useEffect, useCallback } from 'react';
import type { Annotation, Comment, AnnotationMode, UseAnnotationsConfig } from '../lib/types';

const STORAGE_KEY_PREFIX = '@annotation-system';
const STORAGE_KEY_MODE = `${STORAGE_KEY_PREFIX}/mode`;
const STORAGE_KEY_USER = `${STORAGE_KEY_PREFIX}/user`;

function getLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}

function setLocalStorageItem(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

export function useAnnotations(config: UseAnnotationsConfig) {
  const { page, apiBasePath, defaultMode, currentUser: propUser } = config;

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [mode, setModeState] = useState<AnnotationMode>(() => {
    const stored = getLocalStorageItem(STORAGE_KEY_MODE);
    return (stored as AnnotationMode) || defaultMode;
  });
  const [user, setUser] = useState(() => {
    if (propUser) return propUser;
    return getLocalStorageItem(STORAGE_KEY_USER) || 'Anonymous';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalStorageItem(STORAGE_KEY_MODE, mode);
  }, [mode]);

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    } else {
      setLocalStorageItem(STORAGE_KEY_USER, user);
    }
  }, [propUser, user]);

  useEffect(() => {
    if (!page) return;

    setLoading(true);
    setError(null);

    fetch(`${apiBasePath}/annotations?page=${encodeURIComponent(page)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch annotations');
        return res.json();
      })
      .then((data) => setAnnotations(data))
      .catch((err) => {
        console.error('Error fetching annotations:', err);
        setError('Failed to load annotations');
      })
      .finally(() => setLoading(false));
  }, [page, apiBasePath]);

  const setMode = useCallback((newMode: AnnotationMode) => {
    setModeState(newMode);
  }, []);

  const refreshAnnotations = useCallback(() => {
    if (!page) return;

    setError(null);
    fetch(`${apiBasePath}/annotations?page=${encodeURIComponent(page)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch annotations');
        return res.json();
      })
      .then((data) => setAnnotations(data))
      .catch((err) => {
        console.error('Error refreshing annotations:', err);
        setError('Failed to refresh annotations');
      });
  }, [page, apiBasePath]);

  const refreshComments = useCallback(
    (annotationId: string) => {
      setError(null);
      fetch(`${apiBasePath}/comments?annotationId=${encodeURIComponent(annotationId)}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch comments');
          return res.json();
        })
        .then((data) => {
          setComments((prev) => ({
            ...prev,
            [annotationId]: data,
          }));
        })
        .catch((err) => {
          console.error('Error fetching comments:', err);
          setError('Failed to load comments');
        });
    },
    [apiBasePath]
  );

  const createAnnotation = useCallback(
    async (x: number, y: number, content: string, imageUrl?: string) => {
      try {
        const response = await fetch(`${apiBasePath}/annotations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page, x, y, content, imageUrl }),
        });

        if (!response.ok) throw new Error('Failed to create annotation');
        await refreshAnnotations();
      } catch (err) {
        console.error('Error creating annotation:', err);
        setError('Failed to create annotation');
      }
    },
    [page, apiBasePath, refreshAnnotations]
  );

  const updateAnnotation = useCallback(
    async (id: string, updates: Partial<Pick<Annotation, 'x' | 'y' | 'content' | 'imageUrl'>>) => {
      try {
        const response = await fetch(`${apiBasePath}/annotations`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates }),
        });

        if (!response.ok) throw new Error('Failed to update annotation');
        await refreshAnnotations();
      } catch (err) {
        console.error('Error updating annotation:', err);
        setError('Failed to update annotation');
      }
    },
    [apiBasePath, refreshAnnotations]
  );

  const deleteAnnotation = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`${apiBasePath}/annotations?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete annotation');
        await refreshAnnotations();
        setComments((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      } catch (err) {
        console.error('Error deleting annotation:', err);
        setError('Failed to delete annotation');
      }
    },
    [apiBasePath, refreshAnnotations]
  );

  const createComment = useCallback(
    async (annotationId: string, text: string, parentId?: string | null, imageUrl?: string) => {
      try {
        const response = await fetch(`${apiBasePath}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ annotationId, user, text, parentId, imageUrl }),
        });

        if (!response.ok) throw new Error('Failed to create comment');
        await refreshComments(annotationId);
      } catch (err) {
        console.error('Error creating comment:', err);
        setError('Failed to create comment');
      }
    },
    [apiBasePath, user, refreshComments]
  );

  const deleteComment = useCallback(
    async (id: string, annotationId: string) => {
      try {
        const response = await fetch(`${apiBasePath}/comments?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete comment');
        await refreshComments(annotationId);
      } catch (err) {
        console.error('Error deleting comment:', err);
        setError('Failed to delete comment');
      }
    },
    [apiBasePath, refreshComments]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    annotations,
    comments,
    mode,
    setMode,
    user,
    setUser,
    loading,
    error,
    clearError,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
    createComment,
    deleteComment,
    refreshComments,
  };
}
