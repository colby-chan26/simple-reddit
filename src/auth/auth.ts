import Snoowrap from 'snoowrap';

const USER_AGENT = 'Simplified Reddit reader for desktop';
const REDIRECT_URI = 'http://127.0.0.1:5173/';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

export const handleAuthorization = (): void => {
  const authenticationUrl = Snoowrap.getAuthUrl({
    clientId: CLIENT_ID,
    scope: [
      'subscribe',
      'wikiread',
      'vote',
      'mysubreddits',
      'save',
      'read',
      'identity',
      'history',
    ],
    redirectUri: REDIRECT_URI,
    permanent: true,
  });
  window.location.replace(authenticationUrl);
};

export const initializeSnoowrap = async (): Promise<Snoowrap | undefined> => {
  const refreshToken = sessionStorage.getItem('refreshToken');
  if (refreshToken) {
    const r = new Snoowrap({
      clientId: CLIENT_ID,
      clientSecret: '',
      userAgent: USER_AGENT,
      refreshToken,
    });
    return r;
  }

  const authCode = new URL(window.location.href).searchParams.get('code');
  if (authCode) {
    try {
      const r = await Snoowrap.fromAuthCode({
        code: authCode,
        clientId: CLIENT_ID,
        userAgent: USER_AGENT,
        redirectUri: REDIRECT_URI,
      });
      sessionStorage.setItem('refreshToken', r.refreshToken);
      return r;
    } catch (e) {
      console.error(e);
    }
  }

  try {
    const r = await Snoowrap.fromApplicationOnlyAuth(
      {
        clientId: CLIENT_ID,
        userAgent: USER_AGENT,
        deviceId: 'DO_NOT_TRACK_THIS_DEVICE',
      }
    )
    return r;
  } catch (e) {
    console.error(e);
  }
};

export const logout = () => {
  sessionStorage.removeItem('refreshToken')
  window.location.replace('/');
}
