import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  const htmlPath = join(process.cwd(), 'public', 'learning-route.html')
  const htmlContent = readFileSync(htmlPath, 'utf-8')
  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}
