'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationController = AnnotationController;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const STORAGE_KEY_POSITION = '@annotation-system/controller-position';
const STORAGE_KEY_COLLAPSED = '@annotation-system/controller-collapsed';
function getInitialPosition() {
    if (typeof window === 'undefined')
        return { x: 600, y: 500 };
    const stored = localStorage.getItem(STORAGE_KEY_POSITION);
    if (stored) {
        try {
            return JSON.parse(stored);
        }
        catch {
            return { x: window.innerWidth - 200, y: window.innerHeight - 100 };
        }
    }
    return { x: window.innerWidth - 200, y: window.innerHeight - 100 };
}
function getInitialCollapsed() {
    if (typeof window === 'undefined')
        return false;
    return localStorage.getItem(STORAGE_KEY_COLLAPSED) === 'true';
}
function AnnotationController({ mode, setMode, user, setUser, annotationCount, zIndex = 2147483647, theme, }) {
    const [editingUser, setEditingUser] = (0, react_1.useState)(false);
    const [tempUser, setTempUser] = (0, react_1.useState)(user);
    const [position, setPosition] = (0, react_1.useState)(getInitialPosition);
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(getInitialCollapsed);
    const dragRef = (0, react_1.useRef)({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
    const primaryColor = theme?.primary ?? '#ff0000';
    const secondaryColor = theme?.secondary ?? '#3b82f6';
    (0, react_1.useEffect)(() => {
        localStorage.setItem(STORAGE_KEY_POSITION, JSON.stringify(position));
    }, [position]);
    (0, react_1.useEffect)(() => {
        localStorage.setItem(STORAGE_KEY_COLLAPSED, String(isCollapsed));
    }, [isCollapsed]);
    (0, react_1.useEffect)(() => {
        const handleResize = () => {
            if (!isDragging) {
                setPosition((prev) => ({
                    x: Math.min(prev.x, window.innerWidth - 180),
                    y: Math.min(prev.y, window.innerHeight - 160),
                }));
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isDragging]);
    // 切换到 off 模式时自动折叠面板
    (0, react_1.useEffect)(() => {
        if (mode === 'off') {
            setIsCollapsed(true);
        }
    }, [mode]);
    // 键盘快捷键切换模式（避免鼠标点击触发弹窗关闭）
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            // 忽略输入框中的按键
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
    }, [setMode]);
    const modes = [
        { value: 'off', label: 'Off' },
        { value: 'view', label: 'View' },
        { value: 'edit', label: 'Edit' },
    ];
    const handleUserSave = () => {
        if (tempUser.trim()) {
            setUser(tempUser.trim());
        }
        setEditingUser(false);
    };
    const handleMouseDown = (e) => {
        const target = e.target;
        if (target.closest('button') || target.closest('input'))
            return;
        setIsDragging(true);
        dragRef.current.startX = e.clientX;
        dragRef.current.startY = e.clientY;
        dragRef.current.startPosX = position.x;
        dragRef.current.startPosY = position.y;
    };
    (0, react_1.useEffect)(() => {
        if (!isDragging)
            return;
        const handleMouseMove = (e) => {
            const deltaX = e.clientX - dragRef.current.startX;
            const deltaY = e.clientY - dragRef.current.startY;
            const maxX = window.innerWidth - 180;
            const maxY = window.innerHeight - 160;
            setPosition({
                x: Math.max(0, Math.min(maxX, dragRef.current.startPosX + deltaX)),
                y: Math.max(0, Math.min(maxY, dragRef.current.startPosY + deltaY)),
            });
        };
        const handleMouseUp = () => setIsDragging(false);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);
    return ((0, jsx_runtime_1.jsx)("div", { className: `fixed select-none transition-all duration-200 ${isCollapsed
            ? 'w-12 h-12 rounded-full shadow-lg border border-gray-200'
            : 'bg-white rounded-xl shadow-lg border border-gray-200 p-3'} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`, style: {
            left: position.x,
            top: position.y,
            zIndex: zIndex + 400,
            backgroundColor: isCollapsed ? (theme?.panelBg ?? '#ffffff') : (theme?.panelBg ?? '#ffffff'),
            color: theme?.panelText ?? '#374151',
        }, onMouseDown: handleMouseDown, onMouseEnter: () => {
            if (!isDragging && isCollapsed) {
                setIsCollapsed(false);
            }
        }, children: isCollapsed ? ((0, jsx_runtime_1.jsxs)("div", { className: "w-full h-full flex items-center justify-center relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 rounded-full", style: {
                        backgroundColor: mode === 'off' ? '#9ca3af' : mode === 'view' ? secondaryColor : primaryColor,
                        boxShadow: `0 0 0 2px rgba(255,255,255,0.9), 0 0 8px ${mode === 'off' ? '#9ca3af' : mode === 'view' ? secondaryColor : primaryColor}`,
                    } }), annotationCount > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm", children: annotationCount }))] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 rounded-full", style: {
                                backgroundColor: mode === 'off' ? '#9ca3af' : mode === 'view' ? secondaryColor : primaryColor,
                            } }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Annotations" }), annotationCount > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full", children: annotationCount })), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                e.stopPropagation();
                                setIsCollapsed(true);
                            }, className: "ml-auto p-1 hover:bg-gray-100 rounded-full transition-colors", title: "Minimize", children: (0, jsx_runtime_1.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", className: "text-gray-400", children: (0, jsx_runtime_1.jsx)("line", { x1: "5", y1: "12", x2: "19", y2: "12" }) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-1 mb-3", children: modes.map((m) => {
                        const isActive = mode === m.value;
                        const activeColor = m.value === 'edit' ? primaryColor : m.value === 'view' ? secondaryColor : '#6b7280';
                        return ((0, jsx_runtime_1.jsxs)("div", { className: "mode-button flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 select-none", style: {
                                backgroundColor: isActive ? activeColor : '#f3f4f6',
                                color: isActive ? '#ffffff' : '#4b5563',
                            }, children: [m.value === 'off' && (0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { className: "w-4 h-4" }), m.value === 'view' && (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-4 h-4" }), m.value === 'edit' && (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { className: "w-4 h-4" }), m.label, (0, jsx_runtime_1.jsxs)("span", { className: "ml-0.5 opacity-60 text-[9px]", children: [m.value === 'off' && '(O)', m.value === 'view' && '(V)', m.value === 'edit' && '(E)'] })] }, m.value));
                    }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { children: "User:" })] }), editingUser ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: tempUser, onChange: (e) => setTempUser(e.target.value), className: "text-xs px-2 py-0.5 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-16", onKeyDown: (e) => e.key === 'Enter' && handleUserSave(), onClick: (e) => e.stopPropagation() }), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                        e.stopPropagation();
                                        handleUserSave();
                                    }, className: "text-xs px-2 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600", children: "OK" })] })) : ((0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                e.stopPropagation();
                                setEditingUser(true);
                            }, className: "text-xs text-blue-600 hover:text-blue-700 font-medium", children: user }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100", children: [mode === 'edit' && (0, jsx_runtime_1.jsx)("p", { children: "Click to create annotation" }), mode === 'view' && (0, jsx_runtime_1.jsx)("p", { children: "Click annotations to view" }), mode === 'off' && (0, jsx_runtime_1.jsx)("p", { children: "Annotations hidden" })] })] })) }));
}
