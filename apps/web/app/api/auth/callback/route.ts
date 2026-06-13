import { NextResponse } from 'next/server';
import { client } from '@/lib/auth';

export async function GET(request: Request) {
  const params = client.callbackParams(request);
  const tokenSet = await client.callback('https://lostinvirtual.world/api/auth/callback', params);
  
  const response = NextResponse.redirect(new URL('/dashboard', request.url));
  response.cookies.set('token', tokenSet.access_token as string, { httpOnly: true });
  return response;
}
