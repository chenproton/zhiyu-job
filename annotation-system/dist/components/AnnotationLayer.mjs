'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useRef, useEffect } from 'react';
import { AnnotationEditor } from './AnnotationEditor.mjs';
import { CommentPanel } from './CommentPanel.mjs';
export function AnnotationLayer({ annotations, comments, mode, loading, zIndex = 500, theme, onCreateAnnotation, onUpdateAnnotation, onDeleteAnnotation, onCreateComment, onDeleteComment, onRefreshComments, }) {
    const [editorPosition, setEditorPosition] = useState(null);
    const [selectedAnnotation, setSelectedAnnotation] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragAnnotationId, setDragAnnotationId] = useState(null);
    const [dragPosition, setDragPosition] = useState(null);
    const [showPanel, setShowPanel] = useState(false);
    const [currentComments, setCurrentComments] = useState([]);
    const containerRef = useRef(null);
    const primaryColor = theme?.primary ?? '#ef4444';
    useEffect(() => {
        if (selectedAnnotation) {
            setCurrentComments(comments[selectedAnnotation.id] || []);
        }
    }, [selectedAnnotation, comments]);
    // ESC 关闭
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setEditorPosition(null);
                setShowPanel(false);
                setSelectedAnnotation(null);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);
    const handleContainerClick = useCallback((e) => {
        if (mode !== 'edit')
            return;
        if (e.target.closest('.ann-dot'))
            return;
        if (e.target.closest('.ann-panel'))
            return;
        if (e.target.closest('.ann-editor'))
            return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setEditorPosition({ x, y });
    }, [mode]);
    const handleEditorSave = useCallback((content, imageUrl) => {
        if (editorPosition) {
            onCreateAnnotation(editorPosition.x, editorPosition.y, content, imageUrl);
        }
        setEditorPosition(null);
    }, [editorPosition, onCreateAnnotation]);
    const handleAnnotationClick = useCallback((annotation, e) => {
        e.stopPropagation();
        if (mode === 'edit' && isDragging)
            return;
        setSelectedAnnotation(annotation);
        setShowPanel(true);
        onRefreshComments(annotation.id);
    }, [mode, isDragging, onRefreshComments]);
    const handleDragStart = useCallback((annotationId, e) => {
        if (mode !== 'edit')
            return;
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
        if (!isDragging || !dragAnnotationId || !containerRef.current)
            return;
        const container = containerRef.current;
        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
            const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
            setDragPosition({ x, y });
        };
        const handleTouchMove = (e) => {
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
    const handleEditAnnotation = useCallback((content, imageUrl) => {
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
    const handleAddComment = useCallback((text, parentId, imageUrl) => {
        if (selectedAnnotation) {
            onCreateComment(selectedAnnotation.id, text, parentId, imageUrl);
        }
    }, [selectedAnnotation, onCreateComment]);
    const handleDeleteComment = useCallback((id) => {
        if (selectedAnnotation) {
            onDeleteComment(id, selectedAnnotation.id);
        }
    }, [selectedAnnotation, onDeleteComment]);
    if (mode === 'off')
        return null;
    const getAnnotationDisplayPosition = (annotation) => {
        if (isDragging && dragAnnotationId === annotation.id && dragPosition) {
            return dragPosition;
        }
        return { x: annotation.x, y: annotation.y };
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { ref: containerRef, onClick: handleContainerClick, className: "absolute inset-0 pointer-events-none min-h-screen", style: {
                    pointerEvents: mode === 'edit' ? 'auto' : 'none',
                    zIndex,
                }, children: [loading && (_jsx("div", { className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none", style: { zIndex: zIndex + 500 }, children: _jsxs("div", { className: "bg-card/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" }), _jsx("span", { className: "text-sm text-muted-foreground", children: "\u6B63\u5728\u52A0\u8F7D\u6807\u6CE8..." })] }) })), mode === 'edit' && !loading && !editorPosition && (_jsx("div", { className: "fixed bottom-24 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-full shadow-lg text-sm pointer-events-none", style: { zIndex: zIndex + 100 }, children: "\u70B9\u51FB\u9875\u9762\u4EFB\u610F\u4F4D\u7F6E\u521B\u5EFA\u6807\u6CE8" })), annotations.map((annotation, index) => {
                        const pos = getAnnotationDisplayPosition(annotation);
                        return (_jsx("div", { className: `ann-dot absolute rounded-full text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-125 shadow-lg ${mode === 'edit' ? 'cursor-grab active:cursor-grabbing' : ''} ${selectedAnnotation?.id === annotation.id ? 'ring-4 ring-white scale-110' : ''}`, style: {
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transform: 'translate(-50%, -50%)',
                                pointerEvents: 'auto',
                                zIndex: zIndex + 100,
                                backgroundColor: primaryColor,
                                width: theme?.dotSize ?? 32,
                                height: theme?.dotSize ?? 32,
                            }, onClick: (e) => handleAnnotationClick(annotation, e), onMouseDown: (e) => handleDragStart(annotation.id, e), onTouchStart: (e) => handleDragStart(annotation.id, e), title: annotation.content, role: "button", "aria-label": `Annotation ${index + 1}: ${annotation.content}`, tabIndex: 0, children: _jsx("span", { className: "text-xs font-bold", children: index + 1 }) }, annotation.id));
                    })] }), editorPosition && mode === 'edit' && (_jsx("div", { className: "ann-editor absolute inset-0 pointer-events-none", style: { zIndex: zIndex + 500 }, children: _jsx(AnnotationEditor, { x: editorPosition.x, y: editorPosition.y, theme: theme, onSave: handleEditorSave, onCancel: () => setEditorPosition(null) }) })), showPanel && selectedAnnotation && (_jsx(CommentPanel, { annotation: selectedAnnotation, comments: currentComments, zIndex: zIndex, theme: theme, onAddComment: handleAddComment, onDeleteComment: handleDeleteComment, onClose: handleClosePanel, onEditAnnotation: handleEditAnnotation, onDeleteAnnotation: handleDeleteAnnotation, mode: mode }))] }));
}
