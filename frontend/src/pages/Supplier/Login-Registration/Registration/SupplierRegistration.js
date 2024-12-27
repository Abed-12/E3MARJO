import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../../../utils/utils';
import styles from './SupplierRegistration.module.css';


function SupplierRegistration() {

    const [registrationInfo, setRegistrationInfo] = useState({
        supplierName: '',
        email: '',
        supplierID: '',
        password: '',
        confirmPassword: '',
        supplierPhone: '',
        supplierProduct: '',
        role: 'supplier'
    })

    const [file, setFile] = useState(null);

    const handleFileChange = async (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    }

    const navigate = useNavigate();

    const handleChange = async (e) => {
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
            handleError('Numbers only! Letters are not allowed');
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
        const requiredFields = ['supplierName', 'email', 'supplierID', 'supplierPhone', 'password', 'confirmPassword',  'supplierProduct'];

        // التحقق من وجود الحقول المطلوبة
        const missingFields = requiredFields.filter(field => !registrationInfo[field]);

        if (missingFields.length > 0) {
            return handleError(`The following fields are required: ${missingFields.join(', ')}`);
        }

        // التحقق من صحة رقم الهاتف
        if (!handlePhoneValidation(registrationInfo.supplierPhone)) {
            return;
        }

        // if(file == null) {
        //     return handleError(`The MISS FILE`);
        // }

        try {
            const url = `http://localhost:8080/auth/supplier/registration`;
            const formData = new FormData();
            formData.append('body', JSON.stringify(registrationInfo));

            formData.append('commercialRegister', file);
            console.log(Object.fromEntries(formData));

            const response = await fetch(url, {
                method: "POST",
                body: formData
            });
            const result = await response.json();
            console.log(result);
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/supplier-login')
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
        <section className={styles.supplierBody}>
            <div className={styles.supplierRegistrationContainer}>
                <h1 className={styles.supplierRegistrationH1}>Supplier Registration</h1>
                <form className={styles.supplierFormRegistration} onSubmit={handleRegistration}>
                    <div className={styles.supplierRegistrationDiv}>
                        <label className={styles.supplierRegistrationLabel} htmlFor='supplierName'>Supplier Name</label>
                        <input
                            className={styles.supplierRegistrationInput}
                            onChange={handleChange}
                            type='text'
                            name='supplierName'
                            placeholder='Enter your supplier name...'
                            value={registrationInfo.supplierName}
                            autoFocus
                        />
                    </div>
                    <div className={styles.supplierRegistrationDiv}>
                        <label className={styles.supplierRegistrationLabel} htmlFor='email'>Email</label>
                        <input
                            className={styles.supplierRegistrationInput}
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={registrationInfo.email}
                        />
                    </div>
                    <div className={styles.supplierRegistrationDiv}>
                        <label className={styles.supplierRegistrationLabel} htmlFor='supplierID'>Supplier ID</label>
                        <input
                            className={styles.supplierRegistrationInput}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            type='supplierID'
                            name='supplierID'
                            inputMode="numeric" 
                            maxLength="9"
                            placeholder='Enter your supplier ID ...'
                            value={registrationInfo.supplierID}
                        />
                    </div>
                    <div className={styles.supplierRegistrationDiv}>
                        <label className={styles.supplierRegistrationLabel} htmlFor='supplierPhone'>Supplier Phone</label>
                        <input
                            className={styles.supplierRegistrationInput}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            onBlur={(e) => handlePhoneValidation(e.target.value)}
                            type='tel'
                            name='supplierPhone'
                            inputMode="numeric" 
                            maxLength="10"
                            placeholder='Enter your Supplier Phone...'
                            value={registrationInfo.supplierPhone}
                        />
                    </div>
                    <div className={styles.supplierRegistrationDiv}>
                        <label className={styles.supplierRegistrationLabel} htmlFor='password'>Password</label>
                        <input
                            className={styles.supplierRegistrationInput}
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={registrationInfo.password}
                        />
                    </div>
                    <div className={styles.supplierRegistrationDiv}>
                        <label className={styles.supplierRegistrationLabel} htmlFor='confirmPassword'>Confirm Password</label>
                        <input
                            className={styles.supplierRegistrationInput}
                            onChange={handleChange}
                            type='password'
                            name='confirmPassword'
                            placeholder='Enter your Confirm Password...'
                            value={registrationInfo.confirmPassword}
                        />
                    </div>
                    <div className={styles.supplierRegistrationDiv}>
                        <label className={styles.supplierRegistrationLabel} htmlFor='supplierProduct'>Supplier Product</label>
                        <select
                            className={styles.supplierRegistrationSelect}
                            name="supplierProduct" 
                            onChange={handleChange}
                            value={registrationInfo.supplierProduct} 
                        >
                            <option value="">Select an option</option>
                            <option value="concrete">Concrete</option>
                            <option value="cement">Cement</option>
                        </select>
                    </div>
                    <div className={styles.supplierRegistrationDiv}>
                        <label className={styles.supplierRegistrationLabel} htmlFor='commercialRegister'>Commercial Register</label>
                        <input
                            className={styles.supplierCommercialRegister}
                            onChange={handleFileChange}
                            type='file'
                            name='commercialRegister'
                            accept="application/pdf"
                        />
                    </div>

                    <button className={styles.supplierRegistrationButton} type='submit'>Registration</button>
                    <span className={styles.supplierRegistrationSpan}>Already have an account ?
                        <Link className={styles.supplierRegistrationLink} to="/supplier-login"> Login</Link>
                    </span>
                    <span className={styles.supplierRegistrationSpan}>If you are a contracting company?
                        <Link className={styles.supplierRegistrationLink} to="/company-registration"> Contracting Company</Link>
                    </span>
                </form>
                <ToastContainer />
            </div>
        </section>
    )
}

export default SupplierRegistration;
