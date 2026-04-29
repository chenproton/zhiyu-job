'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { EyeOff, Eye, Pencil, Settings, GripVertical } from 'lucide-react';
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
export function AnnotationController({ mode, setMode, user, setUser, annotationCount, zIndex = 2147483647, theme, }) {
    const [editingUser, setEditingUser] = useState(false);
    const [tempUser, setTempUser] = useState(user);
    const [position, setPosition] = useState(getInitialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsed);
    const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
    const primaryColor = theme?.primary ?? '#ff0000';
    const secondaryColor = theme?.secondary ?? '#3b82f6';
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_POSITION, JSON.stringify(position));
    }, [position]);
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_COLLAPSED, String(isCollapsed));
    }, [isCollapsed]);
    useEffect(() => {
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
    useEffect(() => {
        if (mode === 'off') {
            setIsCollapsed(true);
        }
    }, [mode]);
    // 键盘快捷键切换模式（避免鼠标点击触发弹窗关闭）
    useEffect(() => {
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
    useEffect(() => {
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
    return (_jsx("div", { className: `fixed select-none transition-all duration-200 ${isCollapsed
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
        }, children: isCollapsed ? (_jsxs("div", { className: "w-full h-full flex items-center justify-center relative", children: [_jsx("div", { className: "w-4 h-4 rounded-full", style: {
                        backgroundColor: mode === 'off' ? '#9ca3af' : mode === 'view' ? secondaryColor : primaryColor,
                        boxShadow: `0 0 0 2px rgba(255,255,255,0.9), 0 0 8px ${mode === 'off' ? '#9ca3af' : mode === 'view' ? secondaryColor : primaryColor}`,
                    } }), annotationCount > 0 && (_jsx("span", { className: "absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm", children: annotationCount }))] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(GripVertical, { className: "w-4 h-4 text-gray-400" }), _jsx("div", { className: "w-3 h-3 rounded-full", style: {
                                backgroundColor: mode === 'off' ? '#9ca3af' : mode === 'view' ? secondaryColor : primaryColor,
                            } }), _jsx("span", { className: "text-sm font-medium", children: "Annotations" }), annotationCount > 0 && (_jsx("span", { className: "text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full", children: annotationCount })), _jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                setIsCollapsed(true);
                            }, className: "ml-auto p-1 hover:bg-gray-100 rounded-full transition-colors", title: "Minimize", children: _jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", className: "text-gray-400", children: _jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" }) }) })] }), _jsx("div", { className: "flex gap-1 mb-3", children: modes.map((m) => {
                        const isActive = mode === m.value;
                        const activeColor = m.value === 'edit' ? primaryColor : m.value === 'view' ? secondaryColor : '#6b7280';
                        return (_jsxs("div", { className: "mode-button flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 select-none", style: {
                                backgroundColor: isActive ? activeColor : '#f3f4f6',
                                color: isActive ? '#ffffff' : '#4b5563',
                            }, children: [m.value === 'off' && _jsx(EyeOff, { className: "w-4 h-4" }), m.value === 'view' && _jsx(Eye, { className: "w-4 h-4" }), m.value === 'edit' && _jsx(Pencil, { className: "w-4 h-4" }), m.label, _jsxs("span", { className: "ml-0.5 opacity-60 text-[9px]", children: [m.value === 'off' && '(O)', m.value === 'view' && '(V)', m.value === 'edit' && '(E)'] })] }, m.value));
                    }) }), _jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsxs("div", { className: "flex items-center gap-1 text-gray-500", children: [_jsx(Settings, { className: "w-3 h-3" }), _jsx("span", { children: "User:" })] }), editingUser ? (_jsxs("div", { className: "flex gap-1", children: [_jsx("input", { type: "text", value: tempUser, onChange: (e) => setTempUser(e.target.value), className: "text-xs px-2 py-0.5 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-16", onKeyDown: (e) => e.key === 'Enter' && handleUserSave(), onClick: (e) => e.stopPropagation() }), _jsx("button", { onClick: (e) => {
                                        e.stopPropagation();
                                        handleUserSave();
                                    }, className: "text-xs px-2 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600", children: "OK" })] })) : (_jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                setEditingUser(true);
                            }, className: "text-xs text-blue-600 hover:text-blue-700 font-medium", children: user }))] }), _jsxs("div", { className: "text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100", children: [mode === 'edit' && _jsx("p", { children: "Click to create annotation" }), mode === 'view' && _jsx("p", { children: "Click annotations to view" }), mode === 'off' && _jsx("p", { children: "Annotations hidden" })] })] })) }));
}
