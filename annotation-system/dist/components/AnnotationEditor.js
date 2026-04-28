'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationEditor = AnnotationEditor;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function AnnotationEditor({ x, y, theme, onSave, onCancel }) {
    const [content, setContent] = (0, react_1.useState)('');
    const [imageUrl, setImageUrl] = (0, react_1.useState)();
    const inputRef = (0, react_1.useRef)(null);
    const fileInputRef = (0, react_1.useRef)(null);
    const primaryColor = theme?.primary ?? '#ef4444';
    (0, react_1.useEffect)(() => {
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "absolute bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 pointer-events-auto", style: {
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -10px)',
        }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-muted-foreground font-medium", children: "\u65B0\u5EFA\u6807\u6CE8" }), (0, jsx_runtime_1.jsx)("button", { onClick: onCancel, className: "p-1 hover:bg-muted rounded-full transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4 text-muted-foreground" }) })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)("textarea", { ref: inputRef, value: content, onChange: (e) => setContent(e.target.value), placeholder: "\u8F93\u5165\u6807\u6CE8\u5185\u5BB9...", className: "w-full h-24 p-3 border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-background", style: { '--tw-ring-color': primaryColor } }), imageUrl && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 relative", children: [(0, jsx_runtime_1.jsx)("img", { src: imageUrl, alt: "Preview", className: "w-full h-32 object-cover rounded-lg border border-border" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setImageUrl(undefined), className: "absolute top-1 right-1 p-1 bg-foreground/50 text-background rounded-full hover:bg-foreground/70", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-3 h-3" }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-3", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: "image/*", className: "hidden" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => fileInputRef.current?.click(), className: "p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors border border-input", title: "\u6DFB\u52A0\u56FE\u7247", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Image, { className: "w-5 h-5" }) }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onCancel, className: "flex-1 px-3 py-2 text-secondary-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium", children: "\u53D6\u6D88" }), (0, jsx_runtime_1.jsxs)("button", { type: "submit", disabled: !content.trim(), className: "flex-1 px-3 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-1", style: { backgroundColor: primaryColor }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "w-4 h-4" }), "\u4FDD\u5B58"] })] })] })] }));
}
