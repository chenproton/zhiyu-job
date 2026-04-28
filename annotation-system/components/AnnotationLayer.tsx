'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Annotation, AnnotationMode, Comment, AnnotationTheme } from '../lib/types';
import { AnnotationEditor } from './AnnotationEditor';
import { CommentPanel } from './CommentPanel';

interface AnnotationLayerProps {
  annotations: Annotation[];
  comments: { [key: string]: Comment[] };
  mode: AnnotationMode;
  loading: boolean;
  zIndex?: number;
  theme?: AnnotationTheme;
  onCreateAnnotation: (x: number, y: number, content: string, imageUrl?: string) => void;
  onUpdateAnnotation: (id: string, updates: Partial<Pick<Annotation, 'x' | 'y' | 'content' | 'imageUrl'>>) => void;
  onDeleteAnnotation: (id: string) => void;
  onCreateComment: (annotationId: string, text: string, parentId?: string | null, imageUrl?: string) => void;
  onDeleteComment: (id: string, annotationId: string) => void;
  onRefreshComments: (annotationId: string) => void;
}

export function AnnotationLayer({
  annotations,
  comments,
  mode,
  loading,
  zIndex = 500,
  theme,
  onCreateAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  onCreateComment,
  onDeleteComment,
  onRefreshComments,
}: AnnotationLayerProps) {
  const [editorPosition, setEditorPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAnnotationId, setDragAnnotationId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [currentComments, setCurrentComments] = useState<Comment[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const primaryColor = theme?.primary ?? '#ef4444';

  useEffect(() => {
    if (selectedAnnotation) {
      setCurrentComments(comments[selectedAnnotation.id] || []);
    }
  }, [selectedAnnotation, comments]);

  // ESC 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditorPosition(null);
        setShowPanel(false);
        setSelectedAnnotation(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (mode !== 'edit') return;
    if ((e.target as HTMLElement).closest('.ann-dot')) return;
    if ((e.target as HTMLElement).closest('.ann-panel')) return;
    if ((e.target as HTMLElement).closest('.ann-editor')) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setEditorPosition({ x, y });
  }, [mode]);

  const handleEditorSave = useCallback((content: string, imageUrl?: string) => {
    if (editorPosition) {
      onCreateAnnotation(editorPosition.x, editorPosition.y, content, imageUrl);
    }
    setEditorPosition(null);
  }, [editorPosition, onCreateAnnotation]);

  const handleAnnotationClick = useCallback((annotation: Annotation, e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === 'edit' && isDragging) return;

    setSelectedAnnotation(annotation);
    setShowPanel(true);
    onRefreshComments(annotation.id);
  }, [mode, isDragging, onRefreshComments]);

  const handleDragStart = useCallback((annotationId: string, e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== 'edit') return;
    e.stopPropagation();
    setIsDragging(true);
    setDragAnnotationId(annotationId);
    const ann = annotations.find((a) => a.id === annotationId);
    if (ann) {
      setDragPosition({ x: ann.x, y: ann.y });
    }
  }, [mode, annotations]);

  // 拖拽过程只更新本地状态，不调用 API
  useEffect(() => {
    if (!isDragging || !dragAnnotationId || !containerRef.current) return;

    const container = containerRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setDragPosition({ x, y });
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
      setDragPosition({ x, y });
    };

    const handleEnd = () => {
      if (dragPosition) {
        onUpdateAnnotation(dragAnnotationId, { x: dragPosition.x, y: dragPosition.y });
      }
      setIsDragging(false);
      setDragAnnotationId(null);
      setDragPosition(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragAnnotationId, dragPosition, onUpdateAnnotation]);

  const handleClosePanel = useCallback(() => {
    setShowPanel(false);
    setSelectedAnnotation(null);
  }, []);

  const handleEditAnnotation = useCallback((content: string, imageUrl?: string) => {
    if (selectedAnnotation) {
      onUpdateAnnotation(selectedAnnotation.id, { content, imageUrl });
    }
  }, [selectedAnnotation, onUpdateAnnotation]);

  const handleDeleteAnnotation = useCallback(() => {
    if (selectedAnnotation) {
      onDeleteAnnotation(selectedAnnotation.id);
      handleClosePanel();
    }
  }, [selectedAnnotation, onDeleteAnnotation, handleClosePanel]);

  const handleAddComment = useCallback((text: string, parentId?: string | null, imageUrl?: string) => {
    if (selectedAnnotation) {
      onCreateComment(selectedAnnotation.id, text, parentId, imageUrl);
    }
  }, [selectedAnnotation, onCreateComment]);

  const handleDeleteComment = useCallback((id: string) => {
    if (selectedAnnotation) {
      onDeleteComment(id, selectedAnnotation.id);
    }
  }, [selectedAnnotation, onDeleteComment]);

  if (mode === 'off') return null;

  const getAnnotationDisplayPosition = (annotation: Annotation) => {
    if (isDragging && dragAnnotationId === annotation.id && dragPosition) {
      return dragPosition;
    }
    return { x: annotation.x, y: annotation.y };
  };

  return (
    <>
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className="absolute inset-0 pointer-events-none min-h-screen"
        style={{
          pointerEvents: mode === 'edit' ? 'auto' : 'none',
          zIndex,
        }}
      >
        {loading && (
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ zIndex: zIndex + 500 }}
          >
            <div className="bg-card/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">正在加载标注...</span>
            </div>
          </div>
        )}

        {mode === 'edit' && !loading && !editorPosition && (
          <div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-full shadow-lg text-sm pointer-events-none"
            style={{ zIndex: zIndex + 100 }}
          >
            点击页面任意位置创建标注
          </div>
        )}

        {annotations.map((annotation, index) => {
          const pos = getAnnotationDisplayPosition(annotation);
          return (
            <div
              key={annotation.id}
              className={`ann-dot absolute rounded-full text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-125 shadow-lg ${
                mode === 'edit' ? 'cursor-grab active:cursor-grabbing' : ''
              } ${selectedAnnotation?.id === annotation.id ? 'ring-4 ring-white scale-110' : ''}`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto',
                zIndex: zIndex + 100,
                backgroundColor: primaryColor,
                width: theme?.dotSize ?? 32,
                height: theme?.dotSize ?? 32,
              }}
              onClick={(e) => handleAnnotationClick(annotation, e)}
              onMouseDown={(e) => handleDragStart(annotation.id, e)}
              onTouchStart={(e) => handleDragStart(annotation.id, e)}
              title={annotation.content}
              role="button"
              aria-label={`Annotation ${index + 1}: ${annotation.content}`}
              tabIndex={0}
            >
              <span className="text-xs font-bold">{index + 1}</span>
            </div>
          );
        })}
      </div>

      {editorPosition && mode === 'edit' && (
        <div
          className="ann-editor absolute inset-0 pointer-events-none"
          style={{ zIndex: zIndex + 500 }}
        >
          <AnnotationEditor
            x={editorPosition.x}
            y={editorPosition.y}
            theme={theme}
            onSave={handleEditorSave}
            onCancel={() => setEditorPosition(null)}
          />
        </div>
      )}

      {showPanel && selectedAnnotation && (
        <CommentPanel
          annotation={selectedAnnotation}
          comments={currentComments}
          zIndex={zIndex}
          theme={theme}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onClose={handleClosePanel}
          onEditAnnotation={handleEditAnnotation}
          onDeleteAnnotation={handleDeleteAnnotation}
          mode={mode}
        />
      )}
    </>
  );
}
