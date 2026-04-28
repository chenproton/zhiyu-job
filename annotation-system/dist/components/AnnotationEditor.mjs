'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { X, Check, Image as ImageIcon } from 'lucide-react';
export function AnnotationEditor({ x, y, theme, onSave, onCancel }) {
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState();
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const primaryColor = theme?.primary ?? '#ef4444';
    useEffect(() => {
        inputRef.current?.focus();
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
    return (_jsxs("div", { className: "absolute bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 pointer-events-auto", style: {
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -10px)',
        }, children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("span", { className: "text-sm text-muted-foreground font-medium", children: "\u65B0\u5EFA\u6807\u6CE8" }), _jsx("button", { onClick: onCancel, className: "p-1 hover:bg-muted rounded-full transition-colors", children: _jsx(X, { className: "w-4 h-4 text-muted-foreground" }) })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("textarea", { ref: inputRef, value: content, onChange: (e) => setContent(e.target.value), placeholder: "\u8F93\u5165\u6807\u6CE8\u5185\u5BB9...", className: "w-full h-24 p-3 border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-background", style: { '--tw-ring-color': primaryColor } }), imageUrl && (_jsxs("div", { className: "mt-2 relative", children: [_jsx("img", { src: imageUrl, alt: "Preview", className: "w-full h-32 object-cover rounded-lg border border-border" }), _jsx("button", { type: "button", onClick: () => setImageUrl(undefined), className: "absolute top-1 right-1 p-1 bg-foreground/50 text-background rounded-full hover:bg-foreground/70", children: _jsx(X, { className: "w-3 h-3" }) })] })), _jsxs("div", { className: "flex gap-2 mt-3", children: [_jsx("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: "image/*", className: "hidden" }), _jsx("button", { type: "button", onClick: () => fileInputRef.current?.click(), className: "p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors border border-input", title: "\u6DFB\u52A0\u56FE\u7247", children: _jsx(ImageIcon, { className: "w-5 h-5" }) }), _jsx("button", { type: "button", onClick: onCancel, className: "flex-1 px-3 py-2 text-secondary-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium", children: "\u53D6\u6D88" }), _jsxs("button", { type: "submit", disabled: !content.trim(), className: "flex-1 px-3 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-1", style: { backgroundColor: primaryColor }, children: [_jsx(Check, { className: "w-4 h-4" }), "\u4FDD\u5B58"] })] })] })] }));
}
