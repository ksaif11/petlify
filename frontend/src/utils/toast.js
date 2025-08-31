import toast from 'react-hot-toast';

// Toast configuration
const toastConfig = {
  duration: 4000,
  position: 'top-center',
  style: {
    background: '#363636',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
  },
};

// Success toast
export const showSuccess = (message) => {
  toast.success(message, {
    ...toastConfig,
    style: {
      ...toastConfig.style,
      background: '#10b981',
    },
  });
};

// Error toast
export const showError = (message) => {
  toast.error(message, {
    ...toastConfig,
    style: {
      ...toastConfig.style,
      background: '#ef4444',
    },
  });
};



// Warning toast
export const showWarning = (message) => {
  toast(message, {
    ...toastConfig,
    style: {
      ...toastConfig.style,
      background: '#f59e0b',
    },
  });
};


