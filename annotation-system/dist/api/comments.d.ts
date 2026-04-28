import { NextResponse } from 'next/server';
export declare function GET(request: Request): Promise<NextResponse<{
    error: string;
}> | NextResponse<import("..").Comment[]>>;
export declare function POST(request: Request): Promise<NextResponse<{
    error: string;
}> | NextResponse<import("..").Comment>>;
export declare function DELETE(request: Request): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
}>>;
//# sourceMappingURL=comments.d.ts.map