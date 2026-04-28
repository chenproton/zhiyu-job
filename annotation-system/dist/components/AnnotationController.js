'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationController = AnnotationController;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const STORAGE_KEY_POSITION = '@annotation-system/controller-position';
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
function AnnotationController({ mode, setMode, user, setUser, annotationCount, zIndex = 500, theme, }) {
    const [editingUser, setEditingUser] = (0, react_1.useState)(false);
    const [tempUser, setTempUser] = (0, react_1.useState)(user);
    const [position, setPosition] = (0, react_1.useState)(getInitialPosition);
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const dragRef = (0, react_1.useRef)({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
    const primaryColor = theme?.primary ?? '#ef4444';
    const secondaryColor = theme?.secondary ?? '#3b82f6';
    (0, react_1.useEffect)(() => {
        localStorage.setItem(STORAGE_KEY_POSITION, JSON.stringify(position));
    }, [position]);
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
    const modes = [
        { value: 'off', label: '关闭' },
        { value: 'view', label: '查看' },
        { value: 'edit', label: '标注' },
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: `fixed bg-white rounded-xl shadow-lg border border-gray-200 p-3 select-none transition-shadow ${isDragging ? 'shadow-2xl cursor-grabbing' : 'cursor-grab'}`, style: {
            left: position.x,
            top: position.y,
            zIndex: zIndex + 400,
            backgroundColor: theme?.panelBg ?? '#ffffff',
            color: theme?.panelText ?? '#374151',
        }, onMouseDown: handleMouseDown, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "w-4 h-4 text-muted-foreground" }), (0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 rounded-full", style: {
                            backgroundColor: mode === 'off' ? '#9ca3af' : mode === 'view' ? secondaryColor : primaryColor,
                        } }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "\u9875\u9762\u6807\u6CE8" }), annotationCount > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full", children: annotationCount }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-1 mb-3", children: modes.map((m) => {
                    const isActive = mode === m.value;
                    const activeColor = m.value === 'edit' ? primaryColor : m.value === 'view' ? secondaryColor : '#6b7280';
                    return ((0, jsx_runtime_1.jsxs)("button", { onClick: (e) => {
                            e.stopPropagation();
                            setMode(m.value);
                        }, className: "mode-button flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1", style: {
                            backgroundColor: isActive ? activeColor : '#f3f4f6',
                            color: isActive ? '#ffffff' : '#4b5563',
                        }, children: [m.value === 'off' && (0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { className: "w-4 h-4" }), m.value === 'view' && (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-4 h-4" }), m.value === 'edit' && (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { className: "w-4 h-4" }), m.label] }, m.value));
                }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { children: "\u7528\u6237:" })] }), editingUser ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: tempUser, onChange: (e) => setTempUser(e.target.value), className: "text-xs px-2 py-0.5 border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring w-16", onKeyDown: (e) => e.key === 'Enter' && handleUserSave(), onClick: (e) => e.stopPropagation() }), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                    e.stopPropagation();
                                    handleUserSave();
                                }, className: "text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded hover:bg-primary/90", children: "\u786E\u5B9A" })] })) : ((0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                            e.stopPropagation();
                            setEditingUser(true);
                        }, className: "text-xs text-primary hover:text-primary/80 font-medium", children: user }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50", children: [mode === 'edit' && (0, jsx_runtime_1.jsx)("p", { children: "\u70B9\u51FB\u9875\u9762\u4EFB\u610F\u4F4D\u7F6E\u521B\u5EFA\u6807\u6CE8" }), mode === 'view' && (0, jsx_runtime_1.jsx)("p", { children: "\u70B9\u51FB\u6807\u6CE8\u70B9\u67E5\u770B\u8BE6\u60C5\u4E0E\u8BC4\u8BBA" }), mode === 'off' && (0, jsx_runtime_1.jsx)("p", { children: "\u6807\u6CE8\u5DF2\u9690\u85CF" })] })] }));
}
