"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
exports.PUT = PUT;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const json_file_1 = require("../lib/adapters/json-file");
const adapter = (0, json_file_1.createJsonFileAdapter)();
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');
        const context = searchParams.get('context') || 'default';
        if (!page) {
            return server_1.NextResponse.json({ error: 'Page parameter required' }, { status: 400 });
        }
        const annotations = await adapter.getAnnotationsByPage(page, context);
        return server_1.NextResponse.json(annotations);
    }
    catch (error) {
        console.error('Error fetching annotations:', error);
        return server_1.NextResponse.json({ error: 'Failed to fetch annotations' }, { status: 500 });
    }
}
async function POST(request) {
    try {
        const { page, context, x, y, content, imageUrl } = await request.json();
        if (!page || typeof x !== 'number' || typeof y !== 'number' || !content) {
            return server_1.NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }
        const annotation = await adapter.createAnnotation({ page, context, x, y, content, imageUrl });
        return server_1.NextResponse.json(annotation, { status: 201 });
    }
    catch (error) {
        console.error('Error creating annotation:', error);
        return server_1.NextResponse.json({ error: 'Failed to create annotation' }, { status: 500 });
    }
}
async function PUT(request) {
    try {
        const { id, x, y, content, imageUrl } = await request.json();
        if (!id) {
            return server_1.NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const updated = await adapter.updateAnnotation(id, {
            ...(x !== undefined && { x }),
            ...(y !== undefined && { y }),
            ...(content !== undefined && { content }),
            ...(imageUrl !== undefined && { imageUrl }),
        });
        if (!updated) {
            return server_1.NextResponse.json({ error: 'Annotation not found' }, { status: 404 });
        }
        return server_1.NextResponse.json(updated);
    }
    catch (error) {
        console.error('Error updating annotation:', error);
        return server_1.NextResponse.json({ error: 'Failed to update annotation' }, { status: 500 });
    }
}
async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return server_1.NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const deleted = await adapter.deleteAnnotation(id);
        if (!deleted) {
            return server_1.NextResponse.json({ error: 'Annotation not found' }, { status: 404 });
        }
        return server_1.NextResponse.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting annotation:', error);
        return server_1.NextResponse.json({ error: 'Failed to delete annotation' }, { status: 500 });
    }
}
