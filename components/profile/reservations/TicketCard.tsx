import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

type TicketCardProps = {
  ticket: {
    id: number;
    orderNo: string;
    bookingNo: string;
    eventName?: string;
    optionName: string;
    visitDate?: string;
    reservedAt?: string;
    createdAt: string; 
    quantity: number;
    price?: number;
    point?: number;
    status: '예매완료' | '취소완료';
    payMethod?: string;
    buyerName?: string;
  };
  onPress?: (ticket: TicketCardProps['ticket']) => void;
  onCancel?: (ticket: TicketCardProps['ticket']) => void;
};

export default function TicketCard({ ticket, onPress, onCancel }: TicketCardProps) {
  const isCanceled = ticket.status?.trim() === '취소완료';
  const canCancel = ticket.status?.trim() === '예매완료';

  const handleCancel = () => {
    if (!canCancel) return;
    Alert.alert('티켓 취소', '해당 티켓을 취소하시겠습니까?', [
      { text: '아니오', style: 'cancel' },
      { text: '예', style: 'destructive', onPress: () => onCancel?.(ticket) },
    ]);
  };

  const statusStyles = {
    box: ticket.status === '예매완료' ? styles.boxBooked : styles.boxCanceled,
    text: ticket.status === '예매완료' ? styles.statusTextBooked : styles.statusTextCanceled,
  };

  return (
    <TouchableOpacity
      style={[styles.card, isCanceled && { opacity: 0.4 }]}
      activeOpacity={isCanceled ? 1 : 0.9}
      onPress={() => {
        if (!isCanceled) onPress?.(ticket);
      }}
      disabled={isCanceled}
    >
      <View style={styles.headerRow}>
        <Text style={styles.productName}>{ticket.optionName}</Text>
        <TouchableOpacity
          style={[styles.smallGhostBtn, !canCancel && { opacity: 0.4 }]}
          onPress={handleCancel}
          activeOpacity={canCancel ? 0.8 : 1}
          disabled={!canCancel}
        >
          <Text style={[styles.smallGhostText, !canCancel && { color: '#aaa' }]}>취소</Text>
        </TouchableOpacity>
      </View>

      <InfoRow label="주문번호" value={ticket.orderNo} />
      <InfoRow label="행사명" value={ticket.eventName} />
      <InfoRow label="예매일자" value={formatDate(ticket.createdAt)} />
      <InfoRow label="방문일자" value={formatDate(ticket.visitDate)} />
      <InfoRow
        label="결제금액"
        value={`${formatComma(ticket.price)} 원 (${ticket.quantity}매)`}
      />
      <InfoRow label="포인트적립" value={`${formatComma(ticket.point)} 포인트`} />

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View style={styles.infoBoxStatus}>
          <View style={[styles.statusPill, statusStyles.box]}>
            <Text style={[styles.statusText, statusStyles.text]}>{ticket.status}</Text>
          </View>
        </View>

        <View style={styles.infoBoxMid}>
          <View style={styles.lineRow}>
            <Text style={styles.bookingLabel}>예매번호</Text>
            <Text style={styles.bookingNo}>{ticket.bookingNo}</Text>
          </View>
          <View style={styles.lineRow}>
            <Text style={styles.optionText}>
              {ticket.optionName}
              {ticket.quantity > 1 ? ` ${ticket.quantity}매` : ''}
            </Text>
            <Text style={styles.rightPrice}>{formatComma(ticket.price)}원</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? '정보 없음'}</Text>
    </View>
  );
}

function formatDate(iso?: string) {
  if (!iso) return '날짜 정보 없음';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '유효하지 않은 날짜';
  const yoil = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}(${yoil})`;
}

function formatComma(n?: number) {
  if (typeof n !== 'number') return '0';
  return n.toLocaleString();
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9e9e9',
    borderRadius: scale(10),
    padding: scale(16),
    marginBottom: verticalScale(12),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  productName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#111',
  },
  smallGhostBtn: {
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(8),
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: scale(6),
    backgroundColor: '#fff',
  },
  smallGhostText: {
    fontSize: moderateScale(12),
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    gap: scale(8),
    marginTop: verticalScale(8),
  },
  label: {
    width: scale(64),
    fontSize: moderateScale(14),
    color: '#666',
  },
  value: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#222',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9e9e9',
    marginVertical: verticalScale(16),
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoBoxStatus: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBoxMid: {
    flex: 1,
    paddingLeft: scale(8),
    gap: verticalScale(4),
  },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(10),
    borderRadius: 999,
  },
  statusText: {
    fontSize: moderateScale(12),
  },
  statusTextBooked: {
    color: '#4a4f56',
  },
  statusTextCanceled: {
    color: '#DA291C',
  },
  boxBooked: {
    backgroundColor: '#eff2f5',
  },
  boxCanceled: {
    backgroundColor: '#ffecec',
  },
  bookingLabel: {
    fontSize: moderateScale(14),
    color: '#777',
  },
  bookingNo: {
    fontSize: moderateScale(14),
    color: '#DA291C',
    fontWeight: '600',
  },
  optionText: {
    fontSize: moderateScale(14),
    color: '#111',
    fontWeight: '500',
  },
  rightPrice: {
    fontSize: moderateScale(16),
    color: '#111',
    fontWeight: '600',
  },
});