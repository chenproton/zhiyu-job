import type { Annotation, AnnotationMode, Comment, AnnotationTheme } from '../lib/types';
interface AnnotationLayerProps {
    annotations: Annotation[];
    comments: {
        [key: string]: Comment[];
    };
    mode: AnnotationMode;
    loading: boolean;
    zIndex?: number;
    theme?: AnnotationTheme;
    onCreateAnnotation: (x: number, y: number, content: string, imageUrl?: string) => void;
    onUpdateAnnotation: (id: string, updates: Partial<Pick<Annotation, 'x' | 'y' | 'content' | 'imageUrl'>>) => void;
    onDeleteAnnotation: (id: string) => void;
    onCreateComment: (annotationId: string, text: string, parentId?: string | null, imageUrl?: string) => void;
    onDeleteComment: (id: string, annotationId: string) => void;
    onRefreshComments: (annotationId: string) => void;
}
export declare function AnnotationLayer({ annotations, comments, mode, loading, zIndex, theme, onCreateAnnotation, onUpdateAnnotation, onDeleteAnnotation, onCreateComment, onDeleteComment, onRefreshComments, }: AnnotationLayerProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=AnnotationLayer.d.ts.map