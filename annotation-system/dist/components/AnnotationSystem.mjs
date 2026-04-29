'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnnotations } from '../hooks/useAnnotations.mjs';
import { AnnotationLayer } from './AnnotationLayer.mjs';
import { AnnotationController } from './AnnotationController.mjs';
export function AnnotationSystem({ page: pageProp, context = 'default', apiBasePath = '/api', defaultMode = 'view', currentUser, zIndex = 2147483647, theme, onModeChange, hideController = false, }) {
    const pathname = usePathname();
    const [currentPath, setCurrentPath] = useState(pathname || '');
    useEffect(() => {
        setCurrentPath(pathname || '');
    }, [pathname]);
    useEffect(() => {
        const handleRouteChange = () => {
            if (typeof window !== 'undefined') {
                setCurrentPath(window.location.pathname);
            }
        };
        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);
    const page = pageProp || currentPath;
    const { annotations, comments, mode, setMode, user, setUser, loading, createAnnotation, updateAnnotation, deleteAnnotation, createComment, deleteComment, refreshComments, } = useAnnotations({
        page,
        context,
        apiBasePath,
        defaultMode,
        currentUser,
    });
    useEffect(() => {
        onModeChange?.(mode);
    }, [mode, onModeChange]);
    // 当隐藏控制器时，仍然支持键盘快捷键切换模式
    useEffect(() => {
        if (!hideController)
            return;
        const handleKeyDown = (e) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
                return;
            const key = e.key.toLowerCase();
            if (key === 'e') {
                setMode('edit');
            }
            else if (key === 'v') {
                setMode('view');
            }
            else if (key === 'o') {
                setMode('off');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hideController, setMode]);
    const handleRefreshComments = (annotationId) => {
        refreshComments(annotationId);
    };
    return (_jsxs(_Fragment, { children: [_jsx(AnnotationLayer, { annotations: annotations, comments: comments, mode: mode, loading: loading, zIndex: zIndex, theme: theme, onCreateAnnotation: createAnnotation, onUpdateAnnotation: updateAnnotation, onDeleteAnnotation: deleteAnnotation, onCreateComment: createComment, onDeleteComment: deleteComment, onRefreshComments: handleRefreshComments }), !hideController && (_jsx(AnnotationController, { mode: mode, setMode: setMode, user: user, setUser: setUser, annotationCount: annotations.length, zIndex: zIndex, theme: theme }))] }));
}
