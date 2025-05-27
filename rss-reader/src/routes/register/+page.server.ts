import { fail } from '@sveltejs/kit';
import * as usersService from '$lib/server/services/usersService';

export const actions = {
  default: async ({ request }) => {
    try {
      const data = await request.formData();
      const username = data.get('username');
      const email = data.get('email');
      const password = data.get('password');

      if (!username || !email || !password) {
        return fail(400, { error: 'Todos los campos son obligatorios' });
      }
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(String(email))) {
        return fail(400, { error: 'El correo no es válido' });
      }
      if (String(password).length < 6) {
        return fail(400, { error: 'La contraseña debe tener al menos 6 caracteres' });
      }

      await usersService.registerUser({ username: String(username), email: String(email), password: String(password) });
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return fail(400, { error: e.message || 'Error al registrar usuario' });
    }
  }
}; 