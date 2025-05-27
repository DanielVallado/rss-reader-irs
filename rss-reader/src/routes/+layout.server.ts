export const load = async ({ locals }) => {
  const user = locals.user
    ? { ...locals.user, id: Buffer.isBuffer(locals.user.id) ? locals.user.id.toString('hex') : locals.user.id }
    : null;
  return {
    user
  };
}; 