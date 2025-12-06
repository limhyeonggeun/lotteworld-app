import CustomCheckbox from '@/components/common/CustomCheckbox';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface VisitorInfoProps {
  visitor: {
    sameAsBuyer: boolean;
    name: string;
    email: string;
    phone: string;
  };
  buyer: {
    name: string;
    email: string;
    phone: string;
  };
  setVisitor: React.Dispatch<React.SetStateAction<VisitorInfoProps['visitor']>>;
}

const emailDomains = ['naver.com', 'gmail.com', 'daum.net'];
const phonePrefixes = ['선택', '010', '011', '031', '051'];

const DropField = ({
  options,
  selected,
  onSelect,
  width = 120,
  disabled = false,
}: {
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
  width?: number;
  disabled?: boolean;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ width, zIndex: 10 }}>
      <TouchableOpacity
        onPress={() => !disabled && setVisible(!visible)}
        style={[
          styles.dropInput,
          { width },
          disabled && { backgroundColor: '#f2f2f2' },
        ]}
        disabled={disabled}
      >
        <Text style={[styles.dropText, disabled && { color: '#999' }]}>
          {selected}
        </Text>
      </TouchableOpacity>
      {visible && !disabled && (
        <View style={[styles.dropMenu, { width }]}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.dropItem}
              onPress={() => {
                onSelect(opt);
                setVisible(false);
              }}
            >
              <Text style={styles.dropText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const VisitorInfo = ({ visitor, buyer, setVisitor }: VisitorInfoProps) => {
  const emailParts = (visitor.email || '').split('@');
  const [emailDomain, setEmailDomain] = useState(emailParts[1] || '');
  const [emailLocal, setEmailLocal] = useState(emailParts[0] || '');

  useEffect(() => {
    if (emailDomain && emailLocal) {
      setVisitor((prev) => ({
        ...prev,
        email: `${emailLocal}@${emailDomain}`,
      }));
    }
  }, [emailLocal, emailDomain]);

  const handleSameAsBuyer = (value: boolean) => {
    if (value) {
      const [local, domain] = buyer.email.split('@');
      setEmailLocal(local || '');
      setEmailDomain(domain || '');
      setVisitor({
        sameAsBuyer: true,
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
      });
    } else {
      setEmailLocal('');
      setEmailDomain('');
      setVisitor({
        sameAsBuyer: false,
        name: '',
        email: '',
        phone: '',
      });
    }
  };

  const disabled = visitor.sameAsBuyer;

  return (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.title}>방문자 정보</Text>
      </View>

      <View style={styles.infoTable}>
        <View style={styles.rowcheck}>
          <CustomCheckbox
            checked={visitor.sameAsBuyer}
            onChange={handleSameAsBuyer}
          />
          <Text style={styles.checkboxLabel}>구매자 정보와 동일</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>이름</Text>
          <View style={styles.contentWrapper}>
            <TextInput
              style={styles.input}
              value={visitor.name}
              onChangeText={(text) =>
                setVisitor((prev) => ({ ...prev, name: text }))
              }
              placeholder="이름 입력"
              editable={!disabled}
            />
          </View>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>이메일</Text>
          <View style={[styles.contentWrapper, styles.flexRow]}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={emailLocal}
              onChangeText={setEmailLocal}
              placeholder="이메일 아이디"
              editable={!disabled}
            />
            <Text style={styles.at}>@</Text>
            <DropField
              options={emailDomains}
              selected={emailDomain}
              onSelect={setEmailDomain}
              width={scale(100)}
              disabled={disabled}
            />
          </View>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>휴대폰</Text>
          <View style={[styles.contentWrapper, styles.flexRow]}>
            <DropField
              options={phonePrefixes}
              selected={
                phonePrefixes.includes(visitor.phone.slice(0, 3))
                  ? visitor.phone.slice(0, 3)
                  : phonePrefixes[0]
              }
              onSelect={(prefix) =>
                setVisitor((prev) => ({
                  ...prev,
                  phone: `${prefix}${prev.phone.slice(3)}`,
                }))
              }
              width={scale(80)}
              disabled={disabled}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              keyboardType="numeric"
              maxLength={8}
              value={visitor.phone.slice(3)}
              onChangeText={(text) =>
                setVisitor((prev) => ({
                  ...prev,
                  phone: `${prev.phone.slice(0, 3)}${text}`,
                }))
              }
              placeholder="번호 입력"
              editable={!disabled}
            />
          </View>
        </View>
        <Text style={styles.noticeText}>
          받는 사람의 휴대폰 번호로 웹티켓 URL이 전송됩니다.
        </Text>
        <View style={styles.divider} />
      </View>
    </>
  );
};

export default VisitorInfo;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(16),
    marginHorizontal: -scale(16),
    paddingHorizontal: scale(16), 
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E4',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '500',
    paddingVertical: verticalScale(16),
    color: '#111',
  },
  infoTable: {
    paddingHorizontal: verticalScale(8),
  },
  rowcheck: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(14),
  },
  divider: {
    height: 1,
    backgroundColor: '#d9d9d9',
  },
  label: {
    width: scale(80),
    fontSize: moderateScale(16),
    color: '#111',
    fontWeight: '500',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
    gap: verticalScale(8),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scale(4),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    fontSize: moderateScale(14),
    lineHeight: moderateScale(18),
    color: '#111',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  at: {
    fontSize: moderateScale(12),
    color: '#111',
  },
  dropInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scale(4),
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(10),
    backgroundColor: '#fff',
  },
  dropMenu: {
    position: 'absolute',

    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scale(4),
    zIndex: 999,
  },
  dropItem: {
    padding: scale(10),
  },
  dropText: {
    fontSize: moderateScale(14),
    color: '#111',
  },
  checkboxLabel: {
    fontSize: moderateScale(16),
    marginLeft: scale(8),
    color: '#111',
  },
  noticeText: {
    fontSize: moderateScale(14),
    color: '#007aff',
    marginBottom: verticalScale(16),
    textAlign: 'center',
  },
});