import type { Annotation, Comment, AnnotationMode, UseAnnotationsConfig } from '../lib/types';
export declare function useAnnotations(config: UseAnnotationsConfig): {
    annotations: Annotation[];
    comments: Record<string, Comment[]>;
    mode: AnnotationMode;
    setMode: (newMode: AnnotationMode) => void;
    user: string;
    setUser: import("react").Dispatch<import("react").SetStateAction<string>>;
    loading: boolean;
    error: string | null;
    clearError: () => void;
    createAnnotation: (x: number, y: number, content: string, imageUrl?: string) => Promise<void>;
    updateAnnotation: (id: string, updates: Partial<Pick<Annotation, "x" | "y" | "content" | "imageUrl">>) => Promise<void>;
    deleteAnnotation: (id: string) => Promise<void>;
    createComment: (annotationId: string, text: string, parentId?: string | null, imageUrl?: string) => Promise<void>;
    deleteComment: (id: string, annotationId: string) => Promise<void>;
    refreshComments: (annotationId: string) => void;
};
//# sourceMappingURL=useAnnotations.d.ts.map