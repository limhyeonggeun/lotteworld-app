import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import api from '@/utils/axios';
import { useSafeBack } from '@/utils/navigation';

const IMP_CODE = 'imp87822017';

export default function TestCheckoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const safeBack = useSafeBack('/TicketScreen');
  const [isProcessing, setIsProcessing] = useState(false);

  const rawParams = useLocalSearchParams<Record<string, string | string[]>>();
  const params = Object.fromEntries(
    Object.entries(rawParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  ) as Record<string, string | undefined>;

  const {
    amount,
    orderName = '이용권',
    buyerName = 'Guest',
    buyerEmail = 'guest@example.com',
    buyerTel = '01000000000',
    userId,
    ticketId,
    visitDate,
    quantity,
    payMethod,
    counts,
    visitorName,
    visitorEmail,
    visitorPhone,
  } = params;

  const merchantUid = `mid_${Date.now()}`;

  const saveOrder = async (merchantUid: string) => {
    try {
      const res = await api.post('/api/orders', {
        userId,
        ticketId,
        visitDate,
        counts: JSON.parse(counts ?? '{}'),
        quantity,
        amount,
        paymentMethod: payMethod || 'card',
        orderName,
        buyer: {
          name: buyerName,
          email: buyerEmail,
          phone: buyerTel,
        },
        visitor: {
          name: visitorName ?? buyerName,
          email: visitorEmail ?? buyerEmail,
          phone: visitorPhone ?? buyerTel,
        },
      });

      const orderId = res.data.id;

      router.replace({
        pathname: '/(stack)/ticket/PaymentCompleteScreen',
        params: {
          orderId: String(orderId),
          amount: String(amount),
          orderName,
        },
      } as never);
    } catch (err: any) {
      Alert.alert('결제는 성공했지만, 주문 저장에 실패했습니다.');
      safeBack();
    }
  };

  const handleMessage = async (event: any) => {
    try {
      const rsp = JSON.parse(event.nativeEvent.data);

      if (rsp.success === true || rsp.success === 'true') {
        setIsProcessing(true);
        await saveOrder(rsp.merchant_uid);
      } else {
        Alert.alert('결제 실패', rsp.error_msg || '결제가 실패했습니다.');
        safeBack();
      }
    } catch (e) {
      Alert.alert('결제 처리 중 오류가 발생했습니다.');
      safeBack();
    }
  };

  const simulateSuccess = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await saveOrder(merchantUid);
    setIsProcessing(false);
  };

  const html = useMemo(() => `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <title>결제</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.iamport.kr/v1/iamport.js"></script>
      </head>
      <body style="margin:0;padding:24px;font-family:-apple-system">
        <script>
          (function() {
            var IMP = window.IMP;
            IMP.init("${IMP_CODE}");

            IMP.request_pay({
              pg: "html5_inicis.INIpayTest",
              pay_method: "card",
              merchant_uid: "${merchantUid}",
              name: "${orderName}",
              amount: ${Number(amount)},
              buyer_email: "${buyerEmail}",
              buyer_name: "${buyerName}",
              buyer_tel: "${buyerTel}",
              m_redirect_url: "https://example.com/redirect-dummy"
            }, function(rsp) {
              window.ReactNativeWebView.postMessage(JSON.stringify(rsp));
            });
          })();
        </script>
      </body>
    </html>
  `, [amount, orderName, buyerEmail, buyerName, buyerTel]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {isProcessing ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#555" />
          <Text style={styles.loadingText}>결제 처리 중입니다...</Text>
        </View>
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode="always"
          onMessage={handleMessage}
          onShouldStartLoadWithRequest={(event) => {
            const url = event.url;
            if (
              url.startsWith('intent://') ||
              url.startsWith('kakaotalk://') ||
              url.startsWith('ispmobile://')
            ) {
              simulateSuccess();
              return false;
            }
            return true;
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
});