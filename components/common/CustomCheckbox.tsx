import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

const CustomCheckbox = ({ checked, onChange }: CustomCheckboxProps) => {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      style={[
        styles.checkbox,
        checked ? styles.checked : styles.unchecked,
      ]}
    >
      {checked && <Ionicons name="checkmark" size={20} color="white" />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#DA291C',
  },
  unchecked: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default CustomCheckbox;