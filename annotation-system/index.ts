export { AnnotationSystem } from './components/AnnotationSystem';

export { useAnnotations } from './hooks/useAnnotations';

export type { AnnotationAdapter } from './lib/adapter';
export { createJsonFileAdapter } from './lib/adapters/json-file';
export type { JsonFileAdapterOptions } from './lib/adapters/json-file';

export type {
  Annotation,
  Comment,
  AnnotationMode,
  AnnotationStore,
  AnnotationTheme,
  AnnotationSystemProps,
  UseAnnotationsConfig,
} from './lib/types';

export { GET as GET_ANNOTATIONS, POST as POST_ANNOTATIONS, PUT as PUT_ANNOTATIONS, DELETE as DELETE_ANNOTATIONS } from './api/annotations';
export { GET as GET_COMMENTS, POST as POST_COMMENTS, DELETE as DELETE_COMMENTS } from './api/comments';
