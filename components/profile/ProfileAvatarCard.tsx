import { useUser } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const AVATAR_SIZE = scale(80);

type ProfileUser = {
  name?: string;
  email?: string;
  phone?: string;
  avatarUri?: string;
};

type Props = {
  user?: ProfileUser;        
  onEdit?: () => void;
};

export default function ProfileAvatarCard({ user: propUser, onEdit }: Props) {
  const { user: ctxUser } = useUser();

  const displayUser: ProfileUser = useMemo(() => {
    return {
      name: propUser?.name ?? ctxUser?.name,
      email: propUser?.email ?? ctxUser?.email,
      phone: propUser?.phone ?? (ctxUser as any)?.phone,
      avatarUri: propUser?.avatarUri ?? (ctxUser as any)?.avatarUri,
    };
  }, [propUser, ctxUser]);

  const initials = useMemo(() => {
    const name = displayUser?.name || '';
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  }, [displayUser?.name]);

  const formatPhone = (raw?: string) => {
    if (!raw) return '-';
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 11) return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
    if (digits.length === 10) return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`;
    return raw;
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <TouchableOpacity activeOpacity={0.8} onPress={onEdit}>
          <View style={styles.avatarWrap}>
            {displayUser?.avatarUri ? (
              <Image source={{ uri: displayUser.avatarUri }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{initials}</Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={scale(12)} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.profileText}>
          <Text style={styles.profileName}>{displayUser?.name ?? '-'}</Text>
          <Text style={styles.profileEmail}>{displayUser?.email ?? '-'}</Text>
          <Text style={styles.profilePhone}>{formatPhone(displayUser?.phone)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: scale(16),
    marginVertical: verticalScale(16),
    borderRadius: scale(12),
    borderWidth: 2,
    borderColor: '#eee',
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(16),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f2f2f2',
  },
  avatarImg: { 
    width: '100%',
     height: '100%' 
  },
  avatarPlaceholder: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  avatarInitial: { 
    fontSize: moderateScale(20), 
    fontWeight: '700', 
    color: '#555' 
  },
  editBadge: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: '#DA291C',
    width: scale(20),
    height: scale(20),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  profileText: { 
    flex: 1, 
    marginLeft: scale(8),
    gap: verticalScale(4),
  },
  profileName: { 
    fontSize: moderateScale(16), 
    fontWeight: '700',
    color: '#111',
  },
  profileEmail: { 
    fontSize: moderateScale(14), 
    color: '#666' 
  },
  profilePhone: { 
    fontSize: moderateScale(14), 
    color: '#666' 
  },
});