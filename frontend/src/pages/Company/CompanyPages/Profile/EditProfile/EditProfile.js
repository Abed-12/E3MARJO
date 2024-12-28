import React, { useEffect, useState } from 'react'
import { handleError, handleSuccess } from '../../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfile.module.css';
import Navbar from '../../../../../components/navbar/Navbar';
import Footer from '../../../../../components/footer/Footer';

function EditProfile() {
    const [companyData, setCompanyData] = useState('');
    const [editData, setEditData] = useState({
        companyPhone: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/company-login');
        }, 500)
    }    

    const handleChange = (e) => {
        const { name, value } = e.target;

        // تحديث الكائن بشكل ديناميكي
        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }));
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

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if(editData.companyPhone){
            // التحقق من صحة رقم الهاتف
            if (!handlePhoneValidation(editData.companyPhone)) {
                return;
            }
        }
    
        try {
            const url = `http://localhost:8080/auth/company/update-profile`;
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editData)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/company/home/profile");
                }, 500);
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

    const fetchCompanyData = async () => {
        try {
            const url = `http://localhost:8080/auth/company/company-data`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                }
            }
            const response = await fetch(url, headers);
            const result = await response.json();
            console.log(result);
            setCompanyData(result);
        } catch (err) {
            handleError(err);
        }
    }
    
    useEffect(() => {
        fetchCompanyData();
    }, []);

    return(
        <section className={styles.editProfileBody}>
            <Navbar
                one="Home"
                pathOne="/company/home"
                two="Orders"
                two1="Under preparing orders"
                pathTwo1="/company/home/under-preparing-orders"
                two2="Pending orders"
                pathTwo2="/company/home/pending-orders"
                two3="Old orders"
                pathTwo3="/company/home/old-orders"
                three="Cement"
                pathThree="/company/home/cement-orders"
                four="Concrete"
                pathFour="/company/home/concrete-orders"
                five="Profile"
                pathFive="/company/home/profile"
                logout={handleLogout}
            />

            <div className={styles.editProfileContainer}>
                <div className={styles.editProfileRow}>
                    <h1 className={styles.editProfileH1}>Edit profile</h1>
                    <form className={styles.editProfileForm} onSubmit= {handleUpdateProfile}>
                        <div className={styles.editProfileDiv}>
                            <label className={styles.editProfileLabel} htmlFor='companyPhone'><strong>Change the phone number:</strong></label>
                            <input
                                className={styles.editProfileInput}
                                onChange= {handleChange}
                                onKeyPress={handleKeyPress}
                                onBlur={(e) => handlePhoneValidation(e.target.value)}
                                type='tel'
                                name='companyPhone' 
                                inputMode="numeric" 
                                maxLength="10"
                                placeholder= {companyData.companyPhone}
                                value={editData.companyPhone}
                            />
                        </div>
                        <div className={styles.editProfileDiv}>
                            <label className={styles.editProfileLabel} htmlFor='password'><strong>Change the password:</strong></label>
                            <input
                                className={styles.editProfileInput}
                                onChange={handleChange}
                                type='password'
                                name='password'
                                placeholder='Enter your password...'
                                value={editData.password}
                            />
                        </div>
                        <div className={styles.editProfileDiv}>
                            <label className={styles.editProfileLabel} htmlFor='confirmPassword'><strong>Confirm Password</strong></label>
                            <input
                                className={styles.editProfileInput}
                                onChange={handleChange}
                                type='password'
                                name='confirmPassword'
                                placeholder='Enter your Confirm Password...'
                                value={editData.confirmPassword}
                            />
                        </div>
                        <button className={styles.editProfileButton} type='submit'>Update</button>
                    </form>
                </div>
            </div>

            <Footer
                one="Home"
                pathOne="/company/home"
                two="Orders"
                two1="Under preparing orders"
                pathTwo1="/company/home/under-preparing-orders"
                two2="Pending orders"
                pathTwo2="/company/home/pending-orders"
                two3="Old orders"
                pathTwo3="/company/home/old-orders"
                three="Cement"
                pathThree="/company/home/cement-orders"
                four="Concrete"
                pathFour="/company/home/concrete-orders"
                five="Profile"
                pathFive="/company/home/profile"
                logout={handleLogout}
            />
            <ToastContainer />
        </section>
    );
}

export { EditProfile };