export type Annotation = {
    id: string;
    page: string;
    x: number;
    y: number;
    content: string;
    imageUrl?: string;
    createdAt: number;
};
export type Comment = {
    id: string;
    annotationId: string;
    user: string;
    text: string;
    imageUrl?: string;
    createdAt: number;
    parentId?: string | null;
};
export type AnnotationMode = 'off' | 'view' | 'edit';
export interface AnnotationStore {
    annotations: Annotation[];
    comments: Comment[];
}
/** AnnotationSystem 组件主题配置 */
export interface AnnotationTheme {
    /** 主色调（标注点、发送按钮等），默认 #ef4444 */
    primary?: string;
    /** 次色调（查看模式按钮等），默认 #3b82f6 */
    secondary?: string;
    /** 危险/删除色，默认 #ef4444 */
    danger?: string;
    /** 标注点直径（px），默认 32 */
    dotSize?: number;
    /** 控制面板背景色，默认 #ffffff */
    panelBg?: string;
    /** 控制面板文字色，默认 #374151 */
    panelText?: string;
}
/** AnnotationSystem 组件 Props */
export interface AnnotationSystemProps {
    /** 页面标识，默认自动读取 pathname */
    page?: string;
    /** API 路由前缀，默认 "/api" */
    apiBasePath?: string;
    /** 默认模式，默认 "view" */
    defaultMode?: AnnotationMode;
    /** 当前用户名，默认从 localStorage 读取 */
    currentUser?: string;
    /** z-index 基础值，默认 500 */
    zIndex?: number;
    /** 主题配置 */
    theme?: AnnotationTheme;
    /** 模式变化回调 */
    onModeChange?: (mode: AnnotationMode) => void;
}
/** useAnnotations Hook 配置 */
export interface UseAnnotationsConfig {
    page: string;
    apiBasePath: string;
    defaultMode: AnnotationMode;
    currentUser?: string;
}
//# sourceMappingURL=types.d.ts.map