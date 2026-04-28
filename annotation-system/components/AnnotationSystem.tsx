'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnnotations } from '../hooks/useAnnotations';
import { AnnotationLayer } from './AnnotationLayer';
import { AnnotationController } from './AnnotationController';
import type { AnnotationSystemProps } from '../lib/types';

export function AnnotationSystem({
  page: pageProp,
  apiBasePath = '/api',
  defaultMode = 'view',
  currentUser,
  zIndex = 500,
  theme,
  onModeChange,
}: AnnotationSystemProps) {
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

  const {
    annotations,
    comments,
    mode,
    setMode,
    user,
    setUser,
    loading,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
    createComment,
    deleteComment,
    refreshComments,
  } = useAnnotations({
    page,
    apiBasePath,
    defaultMode,
    currentUser,
  });

  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  const handleRefreshComments = (annotationId: string) => {
    refreshComments(annotationId);
  };

  return (
    <>
      <AnnotationLayer
        annotations={annotations}
        comments={comments}
        mode={mode}
        loading={loading}
        zIndex={zIndex}
        theme={theme}
        onCreateAnnotation={createAnnotation}
        onUpdateAnnotation={updateAnnotation}
        onDeleteAnnotation={deleteAnnotation}
        onCreateComment={createComment}
        onDeleteComment={deleteComment}
        onRefreshComments={handleRefreshComments}
      />
      <AnnotationController
        mode={mode}
        setMode={setMode}
        user={user}
        setUser={setUser}
        annotationCount={annotations.length}
        zIndex={zIndex}
        theme={theme}
      />
    </>
  );
}
