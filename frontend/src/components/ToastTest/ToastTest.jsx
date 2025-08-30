import React from 'react';
import { showSuccess, showError, showWarning, showInfo } from '../../utils/toast';
import './ToastTest.css';

const ToastTest = () => {
  const testToasts = () => {
    showSuccess('This is a success message!');
    setTimeout(() => showError('This is an error message!'), 1000);
    setTimeout(() => showWarning('This is a warning message!'), 2000);
    setTimeout(() => showInfo('This is an info message!'), 3000);
  };

  return (
    <div className="toast-test">
      <h2>Toast Notification Test</h2>
      <p>Click the button below to test all types of toast notifications:</p>
      <button onClick={testToasts} className="test-btn">
        Test All Toasts
      </button>
    </div>
  );
};

export default ToastTest;
