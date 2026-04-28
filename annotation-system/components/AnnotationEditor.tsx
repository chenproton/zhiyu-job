'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Check, Image as ImageIcon } from 'lucide-react';
import type { AnnotationTheme } from '../lib/types';

interface AnnotationEditorProps {
  x: number;
  y: number;
  theme?: AnnotationTheme;
  onSave: (content: string, imageUrl?: string) => void;
  onCancel: () => void;
}

export function AnnotationEditor({ x, y, theme, onSave, onCancel }: AnnotationEditorProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const primaryColor = theme?.primary ?? '#ef4444';

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSave(content.trim(), imageUrl);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="absolute bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 pointer-events-auto"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -10px)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-medium">新建标注</span>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-muted rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入标注内容..."
          className="w-full h-24 p-3 border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-background"
          style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
        />

        {imageUrl && (
          <div className="mt-2 relative">
            <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-border" />
            <button
              type="button"
              onClick={() => setImageUrl(undefined)}
              className="absolute top-1 right-1 p-1 bg-foreground/50 text-background rounded-full hover:bg-foreground/70"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors border border-input"
            title="添加图片"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-3 py-2 text-secondary-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={!content.trim()}
            className="flex-1 px-3 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-1"
            style={{ backgroundColor: primaryColor }}
          >
            <Check className="w-4 h-4" />
            保存
          </button>
        </div>
      </form>
    </div>
  );
}
