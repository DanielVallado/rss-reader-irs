import { fail } from '@sveltejs/kit';
import * as usersService from '$lib/server/services/usersService';
import * as authService from '$lib/server/auth/authService';


export const actions = {
  default: async ({ request, cookies }) => {
    try {
      const data = await request.formData();
      const email = data.get("email");
      const password = data.get("password");

      if (!email || !password) {
        return fail(400, { error: "Todos los campos son obligatorios" });
      }
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(String(email))) {
        return fail(400, { error: "El correo no es válido" });
      }

      const userAgent = request.headers.get("user-agent") || "";
      const ipAddress = request.headers.get("x-forwarded-for") || "";
      const deviceInfo = "";

      const { setCookie, user } = await authService.login(
        String(email),
        String(password),
        ipAddress,
        deviceInfo,
        userAgent
      );

      const [cookieName, cookieValue] = setCookie.split("=");
      cookies.set(cookieName, cookieValue, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30 * 6,
      });

      return { success: true, user };
    } catch (e: any) {
      return fail(400, { error: e.message || 'Error al iniciar sesión' });
    }
  }
}; 