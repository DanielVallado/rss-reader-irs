import { redirect } from '@sveltejs/kit';
import * as authService from '$lib/server/auth/authService';

export const POST = async ({ cookies }) => {
  const sessionToken = cookies.get('session_token');
  if (sessionToken) {
    await authService.logout(sessionToken);
    cookies.set('session_token', '', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0
    });
  }
  throw redirect(303, '/login');
}; 