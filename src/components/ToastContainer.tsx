import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useToast } from '../context/ToastContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onHide={hideToast}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    top: Platform.OS === 'web' ? 20 : 60,
    left: 0,
    right: 0,
    zIndex: 9999,
    ...(Platform.OS === 'web' && {
      pointerEvents: 'none',
    }),
  },
});

export default ToastContainer;
