// ConfirmationModal.js
import React from 'react';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
                <p>{message}</p>
                <div className={styles.modalActions}>
                    <button onClick={onConfirm} className={styles.confirmButton}>
                        Yes
                    </button>
                    <button onClick={onCancel} className={styles.cancelButton}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;