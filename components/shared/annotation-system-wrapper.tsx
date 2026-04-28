'use client';

import { AnnotationSystem } from '@my-app/annotation-system';
import { useAuth } from '@/lib/stores/auth-context';

const ANNOTATION_THEME = {
  primary: '#2563eb',      // 项目主色 blue-600
  secondary: '#3b82f6',    // blue-500
  danger: '#dc2626',       // red-600
  dotSize: 28,
  panelBg: '#ffffff',
  panelText: '#374151',
};

export function AnnotationSystemWrapper() {
  const { user } = useAuth();

  return (
    <AnnotationSystem
      currentUser={user?.name ?? '访客'}
      defaultMode="off"
      zIndex={999}
      theme={ANNOTATION_THEME}
    />
  );
}
