"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJsonFileAdapter = createJsonFileAdapter;
require("server-only");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function createJsonFileAdapter(options = {}) {
    const DATA_PATH = options.filePath ||
        process.env.ANNOTATION_SYSTEM_DATA_PATH ||
        path_1.default.join(process.cwd(), 'data/annotations.json');
    let store = null;
    function ensureDataDir() {
        const dir = path_1.default.dirname(DATA_PATH);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
    }
    function loadStore() {
        if (store)
            return store;
        ensureDataDir();
        try {
            const data = fs_1.default.readFileSync(DATA_PATH, 'utf-8');
            store = JSON.parse(data);
        }
        catch {
            store = { annotations: [], comments: [] };
            saveStore();
        }
        return store;
    }
    function saveStore() {
        if (!store)
            return;
        ensureDataDir();
        fs_1.default.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
    }
    return {
        async getAnnotationsByPage(page) {
            const s = loadStore();
            return s.annotations.filter((a) => a.page === page);
        },
        async getAnnotationById(id) {
            const s = loadStore();
            return s.annotations.find((a) => a.id === id);
        },
        async createAnnotation(annotation) {
            const s = loadStore();
            const newAnnotation = {
                ...annotation,
                id: crypto.randomUUID(),
                createdAt: Date.now(),
            };
            s.annotations.push(newAnnotation);
            saveStore();
            return newAnnotation;
        },
        async updateAnnotation(id, updates) {
            const s = loadStore();
            const index = s.annotations.findIndex((a) => a.id === id);
            if (index === -1)
                return undefined;
            s.annotations[index] = { ...s.annotations[index], ...updates };
            saveStore();
            return s.annotations[index];
        },
        async deleteAnnotation(id) {
            const s = loadStore();
            const initialLength = s.annotations.length;
            s.annotations = s.annotations.filter((a) => a.id !== id);
            s.comments = s.comments.filter((c) => c.annotationId !== id);
            saveStore();
            return s.annotations.length !== initialLength;
        },
        async getCommentsByAnnotationId(annotationId) {
            const s = loadStore();
            return s.comments
                .filter((c) => c.annotationId === annotationId)
                .sort((a, b) => a.createdAt - b.createdAt);
        },
        async createComment(comment) {
            const s = loadStore();
            const newComment = {
                ...comment,
                id: crypto.randomUUID(),
                createdAt: Date.now(),
            };
            s.comments.push(newComment);
            saveStore();
            return newComment;
        },
        async deleteComment(id) {
            const s = loadStore();
            const idsToDelete = new Set();
            const queue = [id];
            while (queue.length > 0) {
                const currentId = queue.shift();
                if (!currentId || idsToDelete.has(currentId))
                    continue;
                idsToDelete.add(currentId);
                s.comments.forEach((comment) => {
                    if (comment.parentId === currentId) {
                        queue.push(comment.id);
                    }
                });
            }
            const initialLength = s.comments.length;
            s.comments = s.comments.filter((c) => !idsToDelete.has(c.id));
            saveStore();
            return s.comments.length !== initialLength;
        },
    };
}
