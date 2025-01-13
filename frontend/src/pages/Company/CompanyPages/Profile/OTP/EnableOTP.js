import React, {useState} from 'react';
import {jwtDecode} from "jwt-decode";
import styles from './OTP.module.css';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {handleError, handleSuccess} from '../../../../../utils/utils';
import { useNavigate } from 'react-router-dom';

function EnableOTP() {
    const navigate = useNavigate();

    const decodedData = jwtDecode(localStorage.getItem("token"));

    const [OTPInfo, setOTPInfo] = useState({
        id: decodedData._id,
        otp: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        const copyOTPInfo = {...OTPInfo};
        copyOTPInfo[name] = value;
        setOTPInfo(copyOTPInfo);
    }

    async function cancelOTP (e)
    {
            handleSuccess("Cancle successfully");
            setTimeout(() => {
                navigate('/company/home/profile');
            }, 500);   
    }
    async function confirmOTP(e) {
        e.preventDefault();
        try {
            // Validation check
            if (OTPInfo.otp.length !== 6 || !/^\d+$/.test(OTPInfo.otp)) {
                handleError("Invalid OTP - must be 6 digits");
                return;
            }

            const url = "http://localhost:8080/auth/company/otp/enable/confirm";
            const options = {
                method: 'POST',
                headers: { 
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json' 
                },
                // Only send the OTP value
                body: JSON.stringify({ otp: OTPInfo.otp })
            }
            const response = await fetch(url, options);
            const result = await response.json();

            if (response.ok && result.success) {
                    handleSuccess("OTP enable successfully");
                    setTimeout(() => {
                        navigate('/company/home/profile');
                    }, 500);
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError("Failed to confirm OTP");
        }
    }

    return (
        <section className={styles.otpBody}>
            <div className={styles.otpContainer}>
    

                <h1 className={styles.otpH1}>Enter OTP</h1>
                <form className={styles.otpForm} onSubmit={confirmOTP} >
                    <div className={styles.otpDiv}>
                        <label className={styles.otpLabel} htmlFor='otp'>OTP code </label>
                        <input
                            className={styles.otpInput}
                            onChange={handleChange}
                            type='text' // Changed from 'otp' to 'text'
                            name='otp'
                            placeholder='Enter your OTP...'
                            value={OTPInfo.otp}
                        />
                    </div>
                    <button className={styles.otpButton} type='submit'>Send</button>
                </form>
                <button className={styles.otpButton} onClick={(e)=> cancelOTP()} type='cancel'> Cancel</button>
                <ToastContainer/>

            </div>
        </section>
    )
}

export {EnableOTP};