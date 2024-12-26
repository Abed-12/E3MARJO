import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../../../utils/utils';
import styles from './CompanyRegistration.module.css';

function CompanyRegistration() {

    const [registrationInfo, setRegistrationInfo] = useState({
        companyName: '',
        email: '',
        companyID: '',
        password: '',
        confirmPassword: '',
        companyPhone: '',
        commercialRegister: '',
        role:'company'
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyRegistrationInfo = { ...registrationInfo };
        copyRegistrationInfo[name] = value;
        setRegistrationInfo(copyRegistrationInfo);
    }

    // Phone منع ادخال احرف مثلا في ال 
    const handleKeyPress = (e) => {
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault(); // منع الإدخال إذا لم يكن رقماً
            handleError("Numbers only! Letters are not allowed");
        }
    };
    
    // Phone validation: Phone number must start with 077, 078, or 079 and be followed by 7 digits
    const handlePhoneValidation = (value) => {
        if (value.length !== 10) {
            handleError('Phone number must be exactly 10 digits long');
            return false;
        }
    
        if (!/^(077|078|079)[0-9]{7}$/.test(value)) {
            handleError('Phone number must start with 077, 078, or 079 and be followed by 7 digits');
            return false;
        }
    
        return true;
    };
    
    const handleRegistration = async (e) => {
        e.preventDefault();
        // تحديد الحقول المطلوبة
        const requiredFields = ['companyName', 'email', 'companyID', 'password', 'confirmPassword', 'companyPhone', 'commercialRegister'];

        // التحقق من وجود الحقول المطلوبة
        const missingFields = requiredFields.filter(field => !registrationInfo[field]);

        if (missingFields.length > 0) {
            return handleError(`The following fields are required: ${missingFields.join(', ')}`);
        }

        // التحقق من صحة رقم الهاتف
        if (!handlePhoneValidation(registrationInfo.companyPhone)) {
            return;
        }

        try {
            const url = `http://localhost:8080/auth/company/registration`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/company-login')
                }, 500)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }
    
    return (
        <section className={styles.companyBody}>
            <div className={styles.companyRegistrationContainer}>
                <h1 className={styles.companyRegistrationH1}>Contracting Company Registration</h1>
                <form className={styles.companyFormRegistration} onSubmit={handleRegistration}>
                    <div className={styles.companyRegistrationDiv}>
                        <label className={styles.companyRegistrationLabel} htmlFor='companyName'>Company Name</label>
                        <input
                            className={styles.companyRegistrationInput}
                            onChange={handleChange}
                            type='text'
                            name='companyName'
                            placeholder='Enter your company name...'
                            value={registrationInfo.companyName}
                            autoFocus
                        />
                    </div>
                    <div className={styles.companyRegistrationDiv}>
                        <label className={styles.companyRegistrationLabel} htmlFor='email'>Email</label>
                        <input
                            className={styles.companyRegistrationInput}
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={registrationInfo.email}
                        />
                    </div>
                    <div className={styles.companyRegistrationDiv}>
                        <label className={styles.companyRegistrationLabel} htmlFor='companyID'>Company ID</label>
                        <input
                            className={styles.companyRegistrationInput}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            type='companyID'
                            name='companyID'
                            inputMode="numeric" 
                            maxLength="9"
                            placeholder='Enter your company ID ...'
                            value={registrationInfo.companyID}
                        />
                    </div>
                    <div className={styles.companyRegistrationDiv}>
                        <label className={styles.companyRegistrationLabel} htmlFor='companyPhone'>Company Phone</label>
                        <input
                            className={styles.companyRegistrationInput}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            onBlur={(e) => handlePhoneValidation(e.target.value)}
                            type='tel'
                            name='companyPhone'
                            inputMode="numeric" 
                            maxLength="10"
                            placeholder='Enter your Company Phone...'
                            value={registrationInfo.companyPhone}
                        />
                    </div>
                    <div className={styles.companyRegistrationDiv}>
                        <label className={styles.companyRegistrationLabel} htmlFor='password'>Password</label>
                        <input
                            className={styles.companyRegistrationInput}
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={registrationInfo.password}
                        />
                    </div>
                    <div className={styles.companyRegistrationDiv}>
                        <label className={styles.companyRegistrationLabel} htmlFor='confirmPassword'>Confirm Password</label>
                        <input
                            className={styles.companyRegistrationInput}
                            onChange={handleChange}
                            type='password'
                            name='confirmPassword'
                            placeholder='Enter your Confirm Password...'
                            value={registrationInfo.confirmPassword}
                        />
                    </div>
                    <div className={styles.companyRegistrationDiv}>
                        <label className={styles.companyRegistrationLabel} htmlFor='commercialRegister'>Commercial Register</label>
                        <input
                            className={styles.companyCommercialRegister}
                            onChange={handleChange}
                            type='file'
                            name='commercialRegister'
                            accept=".pdf"
                            value={registrationInfo.commercialRegister}
                        />
                    </div>

                    <button className={styles.companyRegistrationButton} type='submit'>Registration</button>
                    <span className={styles.companyRegistrationSpan}>Already have an account ?
                        <Link className={styles.companyRegistrationLink} to="/company-login"> Login</Link>
                    </span>
                    <span className={styles.companyRegistrationSpan}>If you are a supplier?
                        <Link className={styles.companyRegistrationLink} to="/supplier-registration"> Supplier</Link>
                    </span>
                </form>
                <ToastContainer />
            </div>
        </section>
    )
}

export default CompanyRegistration;
