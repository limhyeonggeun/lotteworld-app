import * as AuthSession from 'expo-auth-session';

const discovery = {
  authorizationEndpoint: 'https://kauth.kakao.com/oauth/authorize',
  tokenEndpoint: 'https://kauth.kakao.com/oauth/token',
} as const;

const NATIVE_APP_KEY = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY!;
export const APP_CALLBACK = `kakao${NATIVE_APP_KEY}://oauth`;
export const redirectUri = 'https://media.seowon.ac.kr/s202011341/auth';

export function useLoginWithKakao() {
  const [request, response, rawPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY!,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      scopes: ['profile_nickname', 'account_email'],
      usePKCE: false,
      extraParams: { prompt: 'login' },
    },
    discovery
  );

  const promptAsync = (options?: AuthSession.AuthRequestPromptOptions) =>
    rawPromptAsync({ preferEphemeralSession: true, ...options });

  return { request, response, promptAsync, redirectUri, appCallback: APP_CALLBACK };
}