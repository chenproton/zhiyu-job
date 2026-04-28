'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Trash2, Reply, User, Image as ImageIcon, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import type { Annotation, Comment, AnnotationMode, AnnotationTheme } from '../lib/types';

interface CommentPanelProps {
  annotation: Annotation;
  comments: Comment[];
  zIndex?: number;
  theme?: AnnotationTheme;
  onAddComment: (text: string, parentId?: string | null, imageUrl?: string) => void;
  onDeleteComment: (id: string) => void;
  onClose: () => void;
  onEditAnnotation: (content: string, imageUrl?: string) => void;
  onDeleteAnnotation: () => void;
  mode: AnnotationMode;
}

export function CommentPanel({
  annotation,
  comments,
  zIndex = 500,
  theme,
  onAddComment,
  onDeleteComment,
  onClose,
  onEditAnnotation,
  onDeleteAnnotation,
  mode,
}: CommentPanelProps) {
  const [newComment, setNewComment] = useState('');
  const [commentImageUrl, setCommentImageUrl] = useState<string | undefined>();
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(annotation.content);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const primaryColor = theme?.primary ?? '#ef4444';

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  // ESC 关闭面板
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 点击外部关闭（移动端除外，避免误触）
  useEffect(() => {
    if (isMobile) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentImageUrl(reader.result as string);
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

  const getNestedComments = (parentId: string | null = null) => {
    return comments.filter((c) =>
      parentId === null ? c.parentId == null : c.parentId === parentId
    );
  };

  const renderCommentThread = (parentId: string | null = null, depth = 0) => {
    const nestedComments = getNestedComments(parentId);
    if (nestedComments.length === 0) return null;

    return (
      <div className="space-y-3 ml-0">
        {nestedComments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-50 rounded-lg p-3"
            style={{ marginLeft: depth > 0 ? '16px' : '0' }}
          >
            <div className="flex items-start gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <User className="w-3 h-3" style={{ color: primaryColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{comment.user}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.createdAt), 'MM月dd日 HH:mm')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap break-words">{comment.text}</p>
                {comment.imageUrl && (
                  <div className="mt-2">
                    <img src={comment.imageUrl} alt="Comment" className="max-w-full h-auto rounded-lg border border-gray-100" />
                  </div>
                )}
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    <Reply className="w-3 h-3" />
                    回复
                  </button>
                  {mode === 'edit' && (
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      删除
                    </button>
                  )}
                </div>

                {replyTo === comment.id && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="写下回复..."
                      className="flex-1 px-3 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring bg-background"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          onAddComment(e.currentTarget.value.trim(), comment.id);
                          e.currentTarget.value = '';
                          setReplyTo(null);
                        }
                      }}
                    />
                  </div>
                )}

                {renderCommentThread(comment.id, depth + 1)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={panelRef}
      className={`fixed bg-white shadow-xl border-l border-gray-200 flex flex-col pointer-events-auto ann-panel ${
        isMobile ? 'bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl border-t' : 'right-0 top-0 h-full w-96'
      }`}
      style={{ zIndex: zIndex + 500 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {comments.length + 1}
          </div>
          <div>
            <h3 className="font-medium text-foreground">标注详情</h3>
            <p className="text-xs text-muted-foreground">
              位置: {annotation.x.toFixed(1)}%, {annotation.y.toFixed(1)}%
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close panel"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              A
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">标注内容</span>
              {isEditing ? (
                <div className="mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-20 p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditContent(annotation.content);
                        setIsEditing(false);
                      }}
                      className="text-xs px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="text-xs px-3 py-1 text-white rounded hover:opacity-90"
                      style={{ backgroundColor: primaryColor }}
                    >
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap break-words">{annotation.content}</p>
                  {annotation.imageUrl && (
                    <div className="mt-2">
                      <img src={annotation.imageUrl} alt="Annotation" className="max-w-full h-auto rounded-lg border border-gray-100 shadow-sm" />
                    </div>
                  )}
                  {mode === 'edit' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" />
                        编辑
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('确定要删除此标注吗？相关评论也将一并删除。')) {
                            onDeleteAnnotation();
                          }
                        }}
                        className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        删除
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            评论 ({comments.length})
          </h4>
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground/70 italic">暂无评论，在下方添加第一条评论吧！</p>
          ) : (
            renderCommentThread()
          )}
        </div>
      </div>

      <div className="p-4 border-t border-border bg-card">
        {commentImageUrl && (
          <div className="mb-2 relative inline-block">
            <img src={commentImageUrl} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-border" />
            <button
              onClick={() => setCommentImageUrl(undefined)}
              className="absolute -top-2 -right-2 p-1 bg-foreground text-background rounded-full hover:bg-foreground/90 shadow-lg"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="添加评论..."
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-background"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors border border-input"
            title="添加图片"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            style={{ backgroundColor: primaryColor }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
