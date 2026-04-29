'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationLayer = AnnotationLayer;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const AnnotationEditor_1 = require("./AnnotationEditor");
const CommentPanel_1 = require("./CommentPanel");
function AnnotationLayer({ annotations, comments, mode, loading, zIndex = 2147483647, theme, onCreateAnnotation, onUpdateAnnotation, onDeleteAnnotation, onCreateComment, onDeleteComment, onRefreshComments, }) {
    const [editorPosition, setEditorPosition] = (0, react_1.useState)(null);
    const [selectedAnnotation, setSelectedAnnotation] = (0, react_1.useState)(null);
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const [dragAnnotationId, setDragAnnotationId] = (0, react_1.useState)(null);
    const [dragPosition, setDragPosition] = (0, react_1.useState)(null);
    const [showPanel, setShowPanel] = (0, react_1.useState)(false);
    const [currentComments, setCurrentComments] = (0, react_1.useState)([]);
    const containerRef = (0, react_1.useRef)(null);
    const primaryColor = theme?.primary ?? '#ff0000';
    (0, react_1.useEffect)(() => {
        if (selectedAnnotation) {
            setCurrentComments(comments[selectedAnnotation.id] || []);
        }
    }, [selectedAnnotation, comments]);
    // ESC 关闭
    (0, react_1.useEffect)(() => {
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
    const handleContainerClick = (0, react_1.useCallback)((e) => {
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
    const handleEditorSave = (0, react_1.useCallback)((content, imageUrl) => {
        if (editorPosition) {
            onCreateAnnotation(editorPosition.x, editorPosition.y, content, imageUrl);
        }
        setEditorPosition(null);
    }, [editorPosition, onCreateAnnotation]);
    const handleAnnotationClick = (0, react_1.useCallback)((annotation, e) => {
        e.stopPropagation();
        if (mode === 'edit' && isDragging)
            return;
        setSelectedAnnotation(annotation);
        setShowPanel(true);
        onRefreshComments(annotation.id);
    }, [mode, isDragging, onRefreshComments]);
    const handleDragStart = (0, react_1.useCallback)((annotationId, e) => {
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
    (0, react_1.useEffect)(() => {
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
    const handleClosePanel = (0, react_1.useCallback)(() => {
        setShowPanel(false);
        setSelectedAnnotation(null);
    }, []);
    const handleEditAnnotation = (0, react_1.useCallback)((content, imageUrl) => {
        if (selectedAnnotation) {
            onUpdateAnnotation(selectedAnnotation.id, { content, imageUrl });
        }
    }, [selectedAnnotation, onUpdateAnnotation]);
    const handleDeleteAnnotation = (0, react_1.useCallback)(() => {
        if (selectedAnnotation) {
            onDeleteAnnotation(selectedAnnotation.id);
            handleClosePanel();
        }
    }, [selectedAnnotation, onDeleteAnnotation, handleClosePanel]);
    const handleAddComment = (0, react_1.useCallback)((text, parentId, imageUrl) => {
        if (selectedAnnotation) {
            onCreateComment(selectedAnnotation.id, text, parentId, imageUrl);
        }
    }, [selectedAnnotation, onCreateComment]);
    const handleDeleteComment = (0, react_1.useCallback)((id) => {
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
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { ref: containerRef, onClick: handleContainerClick, className: "fixed inset-0 pointer-events-none", style: {
                    pointerEvents: mode === 'edit' ? 'auto' : 'none',
                    zIndex,
                }, children: [loading && ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none", style: { zIndex: zIndex + 500 }, children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Loading annotations..." })] }) })), mode === 'edit' && !loading && !editorPosition && ((0, jsx_runtime_1.jsx)("div", { className: "fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg text-sm pointer-events-none", style: { zIndex: zIndex + 100 }, children: "Click anywhere to create an annotation" })), annotations.map((annotation, index) => {
                        const pos = getAnnotationDisplayPosition(annotation);
                        return ((0, jsx_runtime_1.jsxs)("div", { className: `ann-dot absolute rounded-full text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${mode === 'edit' ? 'cursor-grab active:cursor-grabbing' : ''} ${selectedAnnotation?.id === annotation.id ? 'ring-4 ring-white scale-110' : ''}`, style: {
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transform: 'translate(-50%, -50%)',
                                pointerEvents: 'auto',
                                zIndex: zIndex + 100,
                                backgroundColor: primaryColor,
                                width: theme?.dotSize ?? 32,
                                height: theme?.dotSize ?? 32,
                                boxShadow: `0 0 0 3px rgba(255,255,255,0.8), 0 0 20px 4px ${primaryColor}80`,
                            }, onClick: (e) => handleAnnotationClick(annotation, e), onMouseDown: (e) => handleDragStart(annotation.id, e), onTouchStart: (e) => handleDragStart(annotation.id, e), title: annotation.content, role: "button", "aria-label": `Annotation ${index + 1}: ${annotation.content}`, tabIndex: 0, children: [(0, jsx_runtime_1.jsx)("span", { className: "absolute inset-0 rounded-full animate-ping opacity-60", style: { backgroundColor: primaryColor } }), (0, jsx_runtime_1.jsx)("span", { className: "relative text-xs font-bold drop-shadow-md", children: index + 1 })] }, annotation.id));
                    })] }), editorPosition && mode === 'edit' && ((0, jsx_runtime_1.jsx)("div", { className: "ann-editor absolute inset-0 pointer-events-none", style: { zIndex: zIndex + 500 }, children: (0, jsx_runtime_1.jsx)(AnnotationEditor_1.AnnotationEditor, { x: editorPosition.x, y: editorPosition.y, theme: theme, onSave: handleEditorSave, onCancel: () => setEditorPosition(null) }) })), showPanel && selectedAnnotation && ((0, jsx_runtime_1.jsx)(CommentPanel_1.CommentPanel, { annotation: selectedAnnotation, comments: currentComments, zIndex: zIndex, theme: theme, onAddComment: handleAddComment, onDeleteComment: handleDeleteComment, onClose: handleClosePanel, onEditAnnotation: handleEditAnnotation, onDeleteAnnotation: handleDeleteAnnotation, mode: mode }))] }));
}
