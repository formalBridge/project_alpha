import createLoader from 'app/utils/createLoader';

export const loginLoader = createLoader(async () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('Missing Google OAuth environment variables.');
  }

  return { clientId, redirectUri };
});
