import type { AnnotationMode, AnnotationTheme } from '../lib/types';
interface AnnotationControllerProps {
    mode: AnnotationMode;
    setMode: (mode: AnnotationMode) => void;
    user: string;
    setUser: (user: string) => void;
    annotationCount: number;
    zIndex?: number;
    theme?: AnnotationTheme;
}
export declare function AnnotationController({ mode, setMode, user, setUser, annotationCount, zIndex, theme, }: AnnotationControllerProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AnnotationController.d.ts.map