'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentPanel = CommentPanel;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const date_fns_1 = require("date-fns");
function CommentPanel({ annotation, comments, zIndex = 500, theme, onAddComment, onDeleteComment, onClose, onEditAnnotation, onDeleteAnnotation, mode, }) {
    const [newComment, setNewComment] = (0, react_1.useState)('');
    const [commentImageUrl, setCommentImageUrl] = (0, react_1.useState)();
    const [replyTo, setReplyTo] = (0, react_1.useState)(null);
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [editContent, setEditContent] = (0, react_1.useState)(annotation.content);
    const fileInputRef = (0, react_1.useRef)(null);
    const panelRef = (0, react_1.useRef)(null);
    const [isMobile, setIsMobile] = (0, react_1.useState)(false);
    const primaryColor = theme?.primary ?? '#ef4444';
    (0, react_1.useEffect)(() => {
        const updateIsMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        updateIsMobile();
        window.addEventListener('resize', updateIsMobile);
        return () => window.removeEventListener('resize', updateIsMobile);
    }, []);
    // ESC 关闭面板
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    // 点击外部关闭（移动端除外，避免误触）
    (0, react_1.useEffect)(() => {
        if (isMobile)
            return;
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, isMobile]);
    const handleAddComment = () => {
        if (newComment.trim()) {
            onAddComment(newComment.trim(), replyTo || undefined, commentImageUrl);
            setNewComment('');
            setCommentImageUrl(undefined);
            setReplyTo(null);
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCommentImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSaveEdit = () => {
        if (editContent.trim()) {
            onEditAnnotation(editContent.trim(), annotation.imageUrl);
        }
        setIsEditing(false);
    };
    const getNestedComments = (parentId = null) => {
        return comments.filter((c) => parentId === null ? c.parentId == null : c.parentId === parentId);
    };
    const renderCommentThread = (parentId = null, depth = 0) => {
        const nestedComments = getNestedComments(parentId);
        if (nestedComments.length === 0)
            return null;
        return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3 ml-0", children: nestedComments.map((comment) => ((0, jsx_runtime_1.jsx)("div", { className: "bg-gray-50 rounded-lg p-3", style: { marginLeft: depth > 0 ? '16px' : '0' }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0", style: { backgroundColor: `${primaryColor}20` }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-3 h-3", style: { color: primaryColor } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-foreground", children: comment.user }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-muted-foreground", children: (0, date_fns_1.format)(new Date(comment.createdAt), 'MM月dd日 HH:mm') })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground mt-1 whitespace-pre-wrap break-words", children: comment.text }), comment.imageUrl && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsx)("img", { src: comment.imageUrl, alt: "Comment", className: "max-w-full h-auto rounded-lg border border-gray-100" }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 mt-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setReplyTo(replyTo === comment.id ? null : comment.id), className: "text-xs text-primary hover:text-primary/80 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Reply, { className: "w-3 h-3" }), "\u56DE\u590D"] }), mode === 'edit' && ((0, jsx_runtime_1.jsxs)("button", { onClick: () => onDeleteComment(comment.id), className: "text-xs text-destructive hover:text-destructive/80 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-3 h-3" }), "\u5220\u9664"] }))] }), replyTo === comment.id && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 flex gap-2", children: (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "\u5199\u4E0B\u56DE\u590D...", className: "flex-1 px-3 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring bg-background", onKeyDown: (e) => {
                                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                onAddComment(e.currentTarget.value.trim(), comment.id);
                                                e.currentTarget.value = '';
                                                setReplyTo(null);
                                            }
                                        } }) })), renderCommentThread(comment.id, depth + 1)] })] }) }, comment.id))) }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { ref: panelRef, className: `fixed bg-white shadow-xl border-l border-gray-200 flex flex-col pointer-events-auto ann-panel ${isMobile ? 'bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl border-t' : 'right-0 top-0 h-full w-96'}`, style: { zIndex: zIndex + 500 }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm", style: { backgroundColor: primaryColor }, children: comments.length + 1 }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-foreground", children: "\u6807\u6CE8\u8BE6\u60C5" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-muted-foreground", children: ["\u4F4D\u7F6E: ", annotation.x.toFixed(1), "%, ", annotation.y.toFixed(1), "%"] })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 rounded-full transition-colors", "aria-label": "Close panel", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5 text-gray-500" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 overflow-y-auto p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-muted/50 rounded-lg p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0", style: { backgroundColor: primaryColor }, children: "A" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-foreground", children: "\u6807\u6CE8\u5185\u5BB9" }), isEditing ? ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2", children: [(0, jsx_runtime_1.jsx)("textarea", { value: editContent, onChange: (e) => setEditContent(e.target.value), className: "w-full h-20 p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent text-sm", style: { '--tw-ring-color': primaryColor } }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                                                setEditContent(annotation.content);
                                                                setIsEditing(false);
                                                            }, className: "text-xs px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80", children: "\u53D6\u6D88" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSaveEdit, className: "text-xs px-3 py-1 text-white rounded hover:opacity-90", style: { backgroundColor: primaryColor }, children: "\u4FDD\u5B58" })] })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground mt-1 whitespace-pre-wrap break-words", children: annotation.content }), annotation.imageUrl && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsx)("img", { src: annotation.imageUrl, alt: "Annotation", className: "max-w-full h-auto rounded-lg border border-gray-100 shadow-sm" }) })), mode === 'edit' && ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-3", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsEditing(true), className: "text-xs text-primary hover:text-primary/80 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { className: "w-3 h-3" }), "\u7F16\u8F91"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                                                                if (confirm('确定要删除此标注吗？相关评论也将一并删除。')) {
                                                                    onDeleteAnnotation();
                                                                }
                                                            }, className: "text-xs text-destructive hover:text-destructive/80 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-3 h-3" }), "\u5220\u9664"] })] }))] }))] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-sm font-medium text-muted-foreground uppercase tracking-wide", children: ["\u8BC4\u8BBA (", comments.length, ")"] }), comments.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground/70 italic", children: "\u6682\u65E0\u8BC4\u8BBA\uFF0C\u5728\u4E0B\u65B9\u6DFB\u52A0\u7B2C\u4E00\u6761\u8BC4\u8BBA\u5427\uFF01" })) : (renderCommentThread())] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-t border-border bg-card", children: [commentImageUrl && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-2 relative inline-block", children: [(0, jsx_runtime_1.jsx)("img", { src: commentImageUrl, alt: "Preview", className: "h-20 w-20 object-cover rounded-lg border border-border" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setCommentImageUrl(undefined), className: "absolute -top-2 -right-2 p-1 bg-foreground text-background rounded-full hover:bg-foreground/90 shadow-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-3 h-3" }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 relative", children: (0, jsx_runtime_1.jsx)("input", { type: "text", value: newComment, onChange: (e) => setNewComment(e.target.value), placeholder: "\u6DFB\u52A0\u8BC4\u8BBA...", className: "w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-background", style: { '--tw-ring-color': primaryColor }, onKeyDown: (e) => e.key === 'Enter' && handleAddComment() }) }), (0, jsx_runtime_1.jsx)("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: "image/*", className: "hidden" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => fileInputRef.current?.click(), className: "p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors border border-input", title: "\u6DFB\u52A0\u56FE\u7247", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Image, { className: "w-5 h-5" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleAddComment, disabled: !newComment.trim(), className: "px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md", style: { backgroundColor: primaryColor }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Send, { className: "w-5 h-5" }) })] })] })] }));
}
