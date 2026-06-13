import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Logic proteksi route akan diupdate setelah setup client selesai
  return NextResponse.next();
}
