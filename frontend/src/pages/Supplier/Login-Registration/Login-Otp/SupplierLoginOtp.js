import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleError, handleSuccess } from '../../../../utils/utils.js';
import styles from './SupplierLoginOtp.module.css';

function SupplierLoginOtp() {

    const [loginOtpInfo, setLoginOtpInfo] = useState({
        id: localStorage.getItem('userOtpId'),
        otp: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) =>
        {
            const { name, value } = e.target;
        console.log(name, value);
        const copyLoginOtpInfo = {...loginOtpInfo};
        copyLoginOtpInfo[name] = value;
        setLoginOtpInfo(copyLoginOtpInfo);
        }

    const handleLogin = async (e) => {
        e.preventDefault();
        const {otp} = loginOtpInfo;
        if (!otp) {
            return handleError('OTP is required')
        }

        try {
            const url = `http://localhost:8080/auth/supplier/login/otp`;
            const response = await fetch(url, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginOtpInfo)
            });
            const result = await response.json();
            console.log(result);
            const { success, message, jwtToken, role, supplierProduct } = result;
            if (success) {
                handleSuccess(message);
                localStorage.removeItem('userOtpId');
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('role', role);
                localStorage.setItem('supplierProduct', supplierProduct);
                setTimeout(() => { 
                    supplierProduct === "Cement" ? navigate('/supplier/cement/pending-orders') : navigate('/supplier/concrete/home'); // (function) سيتم تنفيذها بعد انتهاء الوقت
                }, 500)
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <section className={styles.supplierBody}>
            <div className={styles.supplierLoginContainer}>
                <h1 className={styles.supplierLoginH1}>Supplier Login</h1>
                <form className={styles.supplierFormLogin} onSubmit={handleLogin}>
                    <div className={styles.supplierDiv}>
                        <label className={styles.supplierLoginLabel} htmlFor='otp'>Login OTP</label>
                        <input
                            className={styles.supplierLoginInput}
                            onChange={handleChange}
                            type='otp'
                            name='otp'
                            placeholder='Enter your OTP...'
                            value={loginOtpInfo.otp}
                        />
                    </div>
                    <button className={styles.supplierLoginButton} type='submit'>Login</button>
                </form>
                <ToastContainer />
            </div>
        </section>
    )
}

export default SupplierLoginOtp;
