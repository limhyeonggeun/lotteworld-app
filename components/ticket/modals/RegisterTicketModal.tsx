import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RegisterTicketModalProps {
  visible: boolean;
  onClose: () => void;
}

const RegisterTicketModal = ({ visible, onClose }: RegisterTicketModalProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const paths = {
    qr: '/ticket/QRCodeRegister',
    reservation: '/ticket/RegisterReservation',
  } as const;

  type Path = (typeof paths)[keyof typeof paths];

  const handleNavigate = (path: Path) => {
    onClose();
    router.push(path);
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={[styles.overlay, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.modalContainer, { paddingBottom: 32 + insets.bottom }]}>
          <Text style={styles.title}>티켓 등록 방법 선택</Text>

          <TouchableOpacity style={styles.optionButton} onPress={() => handleNavigate(paths.qr)}>
            <Text style={styles.optionText}>QR 코드 스캔하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => handleNavigate(paths.reservation)}>
            <Text style={styles.optionText}>예매번호 입력하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingTop: 24,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#111',
  },
  optionButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1d1d1d',
  },
});

export default RegisterTicketModal;