export type NotificationType =
  | 'system'
  | 'ride_closed'
  | 'ride_resumed'
  | 'event'
  | 'parade';

export const ICON_MAP: Record<NotificationType, { icon: string; color: string }> = {
  system: {
    icon: 'settings-outline',
    color: '#00AEEF',
  },
  ride_closed: {
    icon: 'close-circle-outline',
    color: '#FF6B6B',
  },
  ride_resumed: {
    icon: 'refresh-outline',
    color: '#28C76F',
  },
  event: {
    icon: 'sparkles-outline', 
    color: '#5B9AFF',
  },
  parade: {
    icon: 'balloon-outline',
    color: '#E67E22',       
  },
};