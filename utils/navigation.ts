import { useRouter } from 'expo-router';

export function useSafeBack(fallbackPath: string = '/') {
  const router = useRouter();
  return () => {
    if (router.canGoBack()) router.back();
    else router.replace(fallbackPath as any);
  };
}