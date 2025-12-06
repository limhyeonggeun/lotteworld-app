import { modalStyles } from '@/styles/modalStyles';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface GiftTicketModalProps {
  visible: boolean;
  onClose: () => void;
}

const GiftTicketModal = ({ visible, onClose }: GiftTicketModalProps) => {
  const [recipient, setRecipient] = useState('');

  const handleGift = () => {
    console.log('카카오톡 API 호출 예정 - 받는 사람:', recipient);
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={modalStyles.overlay} onPress={onClose}>
        <Pressable style={styles.container}>
          <Text style={styles.title}>예매내역 선물하기</Text>

          <TextInput
            style={styles.input}
            placeholder="010-1234-5678"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={recipient}
            onChangeText={setRecipient}
          />

          <TouchableOpacity
            style={[styles.giftButton, !recipient && styles.disabledButton]}
            onPress={handleGift}
            disabled={!recipient}
          >
            <Text style={styles.giftButtonText}>카카오톡으로 선물하기</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    width: '90%',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#111',
  },
  input: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 20,
    color: '#111',
  },
  giftButton: {
    backgroundColor: '#FEE500',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  giftButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3C1E1E',
  },
  disabledButton: {
    backgroundColor: '#f3f3f3',
  },
});

export default GiftTicketModal;