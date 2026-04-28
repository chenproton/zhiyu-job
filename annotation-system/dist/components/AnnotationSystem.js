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
function AnnotationSystem({ page: pageProp, apiBasePath = '/api', defaultMode = 'view', currentUser, zIndex = 500, theme, onModeChange, }) {
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
        apiBasePath,
        defaultMode,
        currentUser,
    });
    (0, react_1.useEffect)(() => {
        onModeChange?.(mode);
    }, [mode, onModeChange]);
    const handleRefreshComments = (annotationId) => {
        refreshComments(annotationId);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(AnnotationLayer_1.AnnotationLayer, { annotations: annotations, comments: comments, mode: mode, loading: loading, zIndex: zIndex, theme: theme, onCreateAnnotation: createAnnotation, onUpdateAnnotation: updateAnnotation, onDeleteAnnotation: deleteAnnotation, onCreateComment: createComment, onDeleteComment: deleteComment, onRefreshComments: handleRefreshComments }), (0, jsx_runtime_1.jsx)(AnnotationController_1.AnnotationController, { mode: mode, setMode: setMode, user: user, setUser: setUser, annotationCount: annotations.length, zIndex: zIndex, theme: theme })] }));
}
