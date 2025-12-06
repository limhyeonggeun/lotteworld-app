import { modalStyles } from '@/styles/modalStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    moderateScale,
    scale,
    verticalScale,
} from 'react-native-size-matters';
import { JSX } from 'react/jsx-runtime';

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

const HIGHLIGHT_PHRASES = [
  '전자상거래 등에서의 소비자보호에 관한 법률 시행령 제6조 의거, 5년(계약 또는 청약철회 등에 관한 기록, 대금결제 및 재화 등의 공급에 관한 기록)',
  '1. 개인정보 수집 목적: 이벤트 및 할인 정보 안내, 쿠폰 발송, 마케팅 정보 분석',
  '수집일로부터 2년',
  '롯데멤버스',
  '성명, 연락처',
];

const TermsModal = ({ visible, onClose, title, content, onConfirm }: TermsModalProps) => {
  const renderContent = (text: string) => {
    let parts: (string | JSX.Element)[] = [text];

    HIGHLIGHT_PHRASES.forEach((phrase) => {
      const nextParts: (string | JSX.Element)[] = [];

      parts.forEach((part, idx) => {
        if (typeof part === 'string' && part.includes(phrase)) {
          const splitParts = part.split(phrase);
          nextParts.push(splitParts[0]);
          nextParts.push(
            <Text key={`${phrase}-${idx}`} style={styles.highlightedText}>
              {phrase}
            </Text>
          );
          nextParts.push(splitParts[1]);
        } else {
          nextParts.push(part);
        }
      });

      parts = nextParts;
    });

    return <Text style={styles.contentText}>{parts}</Text>;
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.container, styles.modalContainer]}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={moderateScale(24)}
                color="#1d1d1d"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <ScrollView style={styles.contentWrapper}>
            {renderContent(content)}
          </ScrollView>

          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TermsModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  headerRow: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: verticalScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    lineHeight: scale(24),
    color: '#111',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#d9d9d9',
    marginHorizontal: -scale(16),
  },
  contentWrapper: {
    paddingVertical: verticalScale(8),
    maxHeight: verticalScale(200),
  },
  contentText: {
    fontSize: moderateScale(14),
    color: '#1d1d1d',
    lineHeight: verticalScale(18),
  },
  highlightedText: {
    color: '#DA291C',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  confirmButton: {
    marginTop: verticalScale(16),
    backgroundColor: '#DA291C',
    paddingVertical: verticalScale(12),
    borderRadius: scale(2),
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});