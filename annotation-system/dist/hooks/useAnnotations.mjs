import { useState, useEffect, useCallback } from 'react';
const STORAGE_KEY_PREFIX = '@annotation-system';
const STORAGE_KEY_MODE = `${STORAGE_KEY_PREFIX}/mode`;
const STORAGE_KEY_USER = `${STORAGE_KEY_PREFIX}/user`;
function getLocalStorageItem(key) {
    if (typeof window === 'undefined')
        return null;
    return localStorage.getItem(key);
}
function setLocalStorageItem(key, value) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
    }
}
export function useAnnotations(config) {
    const { page, context, apiBasePath, defaultMode, currentUser: propUser } = config;
    const [annotations, setAnnotations] = useState([]);
    const [comments, setComments] = useState({});
    const [mode, setModeState] = useState(() => {
        const stored = getLocalStorageItem(STORAGE_KEY_MODE);
        return stored || defaultMode;
    });
    const [user, setUser] = useState(() => {
        if (propUser)
            return propUser;
        return getLocalStorageItem(STORAGE_KEY_USER) || 'Anonymous';
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        setLocalStorageItem(STORAGE_KEY_MODE, mode);
    }, [mode]);
    useEffect(() => {
        if (propUser) {
            setUser(propUser);
        }
        else {
            setLocalStorageItem(STORAGE_KEY_USER, user);
        }
    }, [propUser, user]);
    useEffect(() => {
        if (!page)
            return;
        setLoading(true);
        setError(null);
        fetch(`${apiBasePath}/annotations?page=${encodeURIComponent(page)}&context=${encodeURIComponent(context || 'default')}`)
            .then((res) => {
            if (!res.ok)
                throw new Error('Failed to fetch annotations');
            return res.json();
        })
            .then((data) => setAnnotations(data))
            .catch((err) => {
            console.error('Error fetching annotations:', err);
            setError('Failed to load annotations');
        })
            .finally(() => setLoading(false));
    }, [page, context, apiBasePath]);
    const setMode = useCallback((newMode) => {
        setModeState(newMode);
    }, []);
    const refreshAnnotations = useCallback(() => {
        if (!page)
            return;
        setError(null);
        fetch(`${apiBasePath}/annotations?page=${encodeURIComponent(page)}&context=${encodeURIComponent(context || 'default')}`)
            .then((res) => {
            if (!res.ok)
                throw new Error('Failed to fetch annotations');
            return res.json();
        })
            .then((data) => setAnnotations(data))
            .catch((err) => {
            console.error('Error refreshing annotations:', err);
            setError('Failed to refresh annotations');
        });
    }, [page, context, apiBasePath]);
    const refreshComments = useCallback((annotationId) => {
        setError(null);
        fetch(`${apiBasePath}/comments?annotationId=${encodeURIComponent(annotationId)}`)
            .then((res) => {
            if (!res.ok)
                throw new Error('Failed to fetch comments');
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
    }, [apiBasePath]);
    const createAnnotation = useCallback(async (x, y, content, imageUrl) => {
        try {
            const response = await fetch(`${apiBasePath}/annotations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page, context, x, y, content, imageUrl }),
            });
            if (!response.ok)
                throw new Error('Failed to create annotation');
            await refreshAnnotations();
        }
        catch (err) {
            console.error('Error creating annotation:', err);
            setError('Failed to create annotation');
        }
    }, [page, context, apiBasePath, refreshAnnotations]);
    const updateAnnotation = useCallback(async (id, updates) => {
        try {
            const response = await fetch(`${apiBasePath}/annotations`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates }),
            });
            if (!response.ok)
                throw new Error('Failed to update annotation');
            await refreshAnnotations();
        }
        catch (err) {
            console.error('Error updating annotation:', err);
            setError('Failed to update annotation');
        }
    }, [apiBasePath, refreshAnnotations]);
    const deleteAnnotation = useCallback(async (id) => {
        try {
            const response = await fetch(`${apiBasePath}/annotations?id=${encodeURIComponent(id)}`, {
                method: 'DELETE',
            });
            if (!response.ok)
                throw new Error('Failed to delete annotation');
            await refreshAnnotations();
            setComments((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
        catch (err) {
            console.error('Error deleting annotation:', err);
            setError('Failed to delete annotation');
        }
    }, [apiBasePath, refreshAnnotations]);
    const createComment = useCallback(async (annotationId, text, parentId, imageUrl) => {
        try {
            const response = await fetch(`${apiBasePath}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ annotationId, user, text, parentId, imageUrl }),
            });
            if (!response.ok)
                throw new Error('Failed to create comment');
            await refreshComments(annotationId);
        }
        catch (err) {
            console.error('Error creating comment:', err);
            setError('Failed to create comment');
        }
    }, [apiBasePath, user, refreshComments]);
    const deleteComment = useCallback(async (id, annotationId) => {
        try {
            const response = await fetch(`${apiBasePath}/comments?id=${encodeURIComponent(id)}`, {
                method: 'DELETE',
            });
            if (!response.ok)
                throw new Error('Failed to delete comment');
            await refreshComments(annotationId);
        }
        catch (err) {
            console.error('Error deleting comment:', err);
            setError('Failed to delete comment');
        }
    }, [apiBasePath, refreshComments]);
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
