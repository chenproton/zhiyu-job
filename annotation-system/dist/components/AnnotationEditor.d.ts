import type { AnnotationTheme } from '../lib/types';
interface AnnotationEditorProps {
    x: number;
    y: number;
    theme?: AnnotationTheme;
    onSave: (content: string, imageUrl?: string) => void;
    onCancel: () => void;
}
export declare function AnnotationEditor({ x, y, theme, onSave, onCancel }: AnnotationEditorProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AnnotationEditor.d.ts.map