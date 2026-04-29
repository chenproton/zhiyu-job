'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationSystem = AnnotationSystem;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const useAnnotations_1 = require("../hooks/useAnnotations");
const AnnotationLayer_1 = require("./AnnotationLayer");
const AnnotationController_1 = require("./AnnotationController");
function AnnotationSystem({ page: pageProp, context = 'default', apiBasePath = '/api', defaultMode = 'view', currentUser, zIndex = 2147483647, theme, onModeChange, hideController = false, }) {
    const pathname = (0, navigation_1.usePathname)();
    const [currentPath, setCurrentPath] = (0, react_1.useState)(pathname || '');
    (0, react_1.useEffect)(() => {
        setCurrentPath(pathname || '');
    }, [pathname]);
    (0, react_1.useEffect)(() => {
        const handleRouteChange = () => {
            if (typeof window !== 'undefined') {
                setCurrentPath(window.location.pathname);
            }
        };
        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);
    const page = pageProp || currentPath;
    const { annotations, comments, mode, setMode, user, setUser, loading, createAnnotation, updateAnnotation, deleteAnnotation, createComment, deleteComment, refreshComments, } = (0, useAnnotations_1.useAnnotations)({
        page,
        context,
        apiBasePath,
        defaultMode,
        currentUser,
    });
    (0, react_1.useEffect)(() => {
        onModeChange?.(mode);
    }, [mode, onModeChange]);
    // 当隐藏控制器时，仍然支持键盘快捷键切换模式
    (0, react_1.useEffect)(() => {
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
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(AnnotationLayer_1.AnnotationLayer, { annotations: annotations, comments: comments, mode: mode, loading: loading, zIndex: zIndex, theme: theme, onCreateAnnotation: createAnnotation, onUpdateAnnotation: updateAnnotation, onDeleteAnnotation: deleteAnnotation, onCreateComment: createComment, onDeleteComment: deleteComment, onRefreshComments: handleRefreshComments }), !hideController && ((0, jsx_runtime_1.jsx)(AnnotationController_1.AnnotationController, { mode: mode, setMode: setMode, user: user, setUser: setUser, annotationCount: annotations.length, zIndex: zIndex, theme: theme }))] }));
}
