'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { X, Check, Image as ImageIcon } from 'lucide-react';
export function AnnotationEditor({ x, y, theme, onSave, onCancel }) {
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState();
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);
    const primaryColor = theme?.primary ?? '#ef4444';
    useEffect(() => {
        inputRef.current?.focus();
    }, []);
    // 阻止 focusin 冒泡到 document，避免被 Dialog/Sheet 的 focus trap 抢回焦点
    useEffect(() => {
        const el = containerRef.current;
        if (!el)
            return;
        const stopPropagation = (e) => {
            e.stopPropagation();
        };
        el.addEventListener('focusin', stopPropagation, true);
        return () => el.removeEventListener('focusin', stopPropagation, true);
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            onSave(content.trim(), imageUrl);
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (_jsxs("div", { ref: containerRef, className: "absolute bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 pointer-events-auto", style: {
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -10px)',
        }, children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("span", { className: "text-sm text-gray-500 font-medium", children: "New Annotation" }), _jsx("button", { onClick: onCancel, className: "p-1 hover:bg-gray-100 rounded-full transition-colors", children: _jsx(X, { className: "w-4 h-4 text-gray-500" }) })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("textarea", { ref: inputRef, value: content, onChange: (e) => setContent(e.target.value), placeholder: "Enter annotation content...", className: "w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent text-sm", style: { '--tw-ring-color': primaryColor } }), imageUrl && (_jsxs("div", { className: "mt-2 relative", children: [_jsx("img", { src: imageUrl, alt: "Preview", className: "w-full h-32 object-cover rounded-lg border border-gray-100" }), _jsx("button", { type: "button", onClick: () => setImageUrl(undefined), className: "absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70", children: _jsx(X, { className: "w-3 h-3" }) })] })), _jsxs("div", { className: "flex gap-2 mt-3", children: [_jsx("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: "image/*", className: "hidden" }), _jsx("button", { type: "button", onClick: () => fileInputRef.current?.click(), className: "p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200", title: "Add image", children: _jsx(ImageIcon, { className: "w-5 h-5" }) }), _jsx("button", { type: "button", onClick: onCancel, className: "flex-1 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium", children: "Cancel" }), _jsxs("button", { type: "submit", disabled: !content.trim(), className: "flex-1 px-3 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-1", style: { backgroundColor: primaryColor }, children: [_jsx(Check, { className: "w-4 h-4" }), "Save"] })] })] })] }));
}
