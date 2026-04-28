export { AnnotationSystem } from './components/AnnotationSystem.mjs';
export { useAnnotations } from './hooks/useAnnotations.mjs';
export { createJsonFileAdapter } from './lib/adapters/json-file.mjs';
export { GET as GET_ANNOTATIONS, POST as POST_ANNOTATIONS, PUT as PUT_ANNOTATIONS, DELETE as DELETE_ANNOTATIONS } from './api/annotations.mjs';
export { GET as GET_COMMENTS, POST as POST_COMMENTS, DELETE as DELETE_COMMENTS } from './api/comments.mjs';
