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
export declare function CommentPanel({ annotation, comments, zIndex, theme, onAddComment, onDeleteComment, onClose, onEditAnnotation, onDeleteAnnotation, mode, }: CommentPanelProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CommentPanel.d.ts.map