import { NextResponse } from 'next/server';
import { createJsonFileAdapter } from '../lib/adapters/json-file.mjs';
const adapter = createJsonFileAdapter();
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');
        if (!page) {
            return NextResponse.json({ error: 'Page parameter required' }, { status: 400 });
        }
        const annotations = await adapter.getAnnotationsByPage(page);
        return NextResponse.json(annotations);
    }
    catch (error) {
        console.error('Error fetching annotations:', error);
        return NextResponse.json({ error: 'Failed to fetch annotations' }, { status: 500 });
    }
}
export async function POST(request) {
    try {
        const { page, x, y, content, imageUrl } = await request.json();
        if (!page || typeof x !== 'number' || typeof y !== 'number' || !content) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }
        const annotation = await adapter.createAnnotation({ page, x, y, content, imageUrl });
        return NextResponse.json(annotation, { status: 201 });
    }
    catch (error) {
        console.error('Error creating annotation:', error);
        return NextResponse.json({ error: 'Failed to create annotation' }, { status: 500 });
    }
}
export async function PUT(request) {
    try {
        const { id, x, y, content, imageUrl } = await request.json();
        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const updated = await adapter.updateAnnotation(id, {
            ...(x !== undefined && { x }),
            ...(y !== undefined && { y }),
            ...(content !== undefined && { content }),
            ...(imageUrl !== undefined && { imageUrl }),
        });
        if (!updated) {
            return NextResponse.json({ error: 'Annotation not found' }, { status: 404 });
        }
        return NextResponse.json(updated);
    }
    catch (error) {
        console.error('Error updating annotation:', error);
        return NextResponse.json({ error: 'Failed to update annotation' }, { status: 500 });
    }
}
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        const deleted = await adapter.deleteAnnotation(id);
        if (!deleted) {
            return NextResponse.json({ error: 'Annotation not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting annotation:', error);
        return NextResponse.json({ error: 'Failed to delete annotation' }, { status: 500 });
    }
}
