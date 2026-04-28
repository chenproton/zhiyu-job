"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const json_file_1 = require("../lib/adapters/json-file");
const adapter = (0, json_file_1.createJsonFileAdapter)();
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const annotationId = searchParams.get('annotationId');
        if (!annotationId) {
            return server_1.NextResponse.json({ error: 'Annotation ID required' }, { status: 400 });
        }
        const comments = await adapter.getCommentsByAnnotationId(annotationId);
        return server_1.NextResponse.json(comments);
    }
    catch (error) {
        console.error('Error fetching comments:', error);
        return server_1.NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}
async function POST(request) {
    try {
        const { annotationId, user, text, parentId, imageUrl } = await request.json();
        if (!annotationId || !user || !text) {
            return server_1.NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }
        const comment = await adapter.createComment({ annotationId, user, text, parentId, imageUrl });
        return server_1.NextResponse.json(comment, { status: 201 });
    }
    catch (error) {
        console.error('Error creating comment:', error);
        return server_1.NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}
async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return server_1.NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const deleted = await adapter.deleteComment(id);
        if (!deleted) {
            return server_1.NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }
        return server_1.NextResponse.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        return server_1.NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
    }
}
