import { NextResponse } from 'next/server';
export declare function GET(request: Request): Promise<NextResponse<{
    error: string;
}> | NextResponse<import("..").Annotation[]>>;
export declare function POST(request: Request): Promise<NextResponse<{
    error: string;
}> | NextResponse<import("..").Annotation>>;
export declare function PUT(request: Request): Promise<NextResponse<import("..").Annotation> | NextResponse<{
    error: string;
}>>;
export declare function DELETE(request: Request): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
}>>;
//# sourceMappingURL=annotations.d.ts.map