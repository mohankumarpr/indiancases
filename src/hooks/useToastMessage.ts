import { useToast as useToastContext } from '../context/ToastContext';

export const useToastMessage = () => {
  const { showToast } = useToastContext();

  const showSuccess = (title: string, message?: string, options?: { duration?: number; action?: { label: string; onPress: () => void } }) => {
    showToast({
      type: 'success',
      title,
      message,
      duration: options?.duration,
      action: options?.action,
    });
  };

  const showError = (title: string, message?: string, options?: { duration?: number; action?: { label: string; onPress: () => void } }) => {
    showToast({
      type: 'error',
      title,
      message,
      duration: options?.duration,
      action: options?.action,
    });
  };

  const showWarning = (title: string, message?: string, options?: { duration?: number; action?: { label: string; onPress: () => void } }) => {
    showToast({
      type: 'warning',
      title,
      message,
      duration: options?.duration,
      action: options?.action,
    });
  };

  const showInfo = (title: string, message?: string, options?: { duration?: number; action?: { label: string; onPress: () => void } }) => {
    showToast({
      type: 'info',
      title,
      message,
      duration: options?.duration,
      action: options?.action,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
