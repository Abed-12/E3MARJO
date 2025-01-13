import React, {useState} from 'react'
import { useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {handleError, handleSuccess} from '../../../../utils/utils.js';
import styles from './CompanyLoginOtp.module.css';


function CompanyLoginOtp() {

    const [loginOtpInfo, setLoginOtpInfo] = useState({
        id: localStorage.getItem('userOtpId'),
        otp: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
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
            const url = `http://localhost:8080/auth/company/login/otp`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginOtpInfo)
            });
            const result = await response.json();
            const {success, message, jwtToken, role} = result;
            if (success) {
                handleSuccess(message);
                localStorage.removeItem('userOtpId');
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('role', role);
                setTimeout(() => {
                    navigate('/company/home')
                }, 500)
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <section className={styles.companyBody}>
            <div className={styles.companyLoginContainer}>
                <h1 className={styles.companyLoginH1}>Contracting <br/>Company Login</h1>
                <form className={styles.companyFormLogin} onSubmit={handleLogin}>
                    <div className={styles.companyDiv}>
                        <label className={styles.companyLoginLabel} htmlFor='otp'>Login OTP</label>
                        <input
                            className={styles.companyLoginInput}
                            onChange={handleChange}
                            type='otp'
                            name='otp'
                            placeholder='Enter your OTP...'
                            value={loginOtpInfo.otp}
                        />
                    </div>
                    <button className={styles.companyLoginButton} type='submit'>Login</button>
                </form>
                <ToastContainer/>
            </div>
        </section>
    )
}

export default CompanyLoginOtp;
