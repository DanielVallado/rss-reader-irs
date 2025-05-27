import type { Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth/authService';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session_token');
	if (!sessionToken) {
		event.locals.user = null;
		return resolve(event);
	}

	const user = await validateSession(sessionToken);
	event.locals.user = user
		? { ...user, id: Buffer.isBuffer(user.id) ? user.id.toString('hex') : user.id }
		: null;

	return resolve(event);
};
