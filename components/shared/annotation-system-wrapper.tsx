'use client';

import { useEffect, useState } from 'react';
import { AnnotationSystem } from '@my-app/annotation-system';
import { useAuth } from '@/lib/stores/auth-context';

const ANNOTATION_THEME = {
  primary: '#2563eb',      // 项目主色 blue-600
  secondary: '#3b82f6',    // blue-500
  danger: '#ef4444',       // red-500
  dotSize: 28,
  panelBg: '#ffffff',
  panelText: '#1f2937',
};

export function AnnotationSystemWrapper() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnnotationSystem
      currentUser={user?.name ?? '访客'}
      defaultMode="view"
      zIndex={50}
      theme={ANNOTATION_THEME}
    />
  );
}
