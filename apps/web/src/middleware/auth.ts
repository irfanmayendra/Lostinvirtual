import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function authMiddleware(request: NextRequest) {
  // Integrasi logic OIDC di sini
  // Cek session via cookie/header
  return NextResponse.next();
}
