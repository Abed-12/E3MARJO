import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OTP.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleError, handleSuccess } from '../../../../../utils/utils';

function DisableOTP() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [otp, setOtp] = useState('');

    const handleChange = (e) => {
        setOtp(e.target.value);
    }

    async function cancelOTP (e)
    {
            handleSuccess("Cancle successfully");
            setTimeout(() => {
                navigate('/company/home/profile');
            }, 500);   
    }
    async function confirmDisable(e) {
        e.preventDefault();
        try {
            // Validation check
            if (otp.length !== 6 || !/^\d+$/.test(otp)) {
                handleError("Invalid OTP - must be 6 digits");
                return;
            }

            const url = "http://localhost:8080/auth/company/otp/disable/confirm";
            const options = {
                method: 'POST',
                headers: { 
                    'Authorization': token,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ otp })
            }
            const response = await fetch(url, options);
            const result = await response.json();

            if (response.ok && result.success) {
                handleSuccess("OTP disabled successfully");
                setTimeout(() => {
                    navigate('/company/home/profile');
                }, 500);
            } else {
                handleError(result.message || "Failed to disable OTP");
            }
        } catch (err) {
            handleError("Failed to disable OTP");
            console.log('Error details:', err);
        }
    }

    return (
        <section className={styles.otpBody}>
            <div className={styles.otpContainer}>
                <h1 className={styles.otpH1}>Disable OTP</h1>
                <form className={styles.otpForm} onSubmit={confirmDisable}>
                    <div className={styles.otpDiv}>
                        <label className={styles.otpLabel} htmlFor='otp'>Enter OTP</label>
                        <input
                            className={styles.otpInput}
                            onChange={handleChange}
                            type='otp'
                            name='otp'
                            placeholder='Enter your OTP...'
                            value={otp}
                        />
                    </div>
                    <button className={styles.otpButton} type='submit'>Disable OTP</button>

                </form>
                <button className={styles.otpButton} onClick={(e)=> cancelOTP()} type='cancel'> Cancel</button>
                <ToastContainer/>
            </div>
        </section>
    )
}

export { DisableOTP };