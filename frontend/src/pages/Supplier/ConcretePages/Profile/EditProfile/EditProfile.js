import React, { useEffect, useState } from 'react'
import { handleError, handleSuccess } from '../../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfile.module.css';
import Navbar from '../../../../../components/navbar/Navbar';
import Footer from '../../../../../components/footer/Footer';

function EditProfile() {
    const [supplierData, setSupplierData] = useState(null);
    const [editData, setEditData] = useState({
        supplierPhone: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('supplierProduct');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/supplier-login');
        }, 500)
    }    

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // تحقق من حقل "amountOfconcrete" فقط
        if (name === "price") {
            if (value === ".") {
                handleError("Dots alone are not acceptable input");
                return;
            } else if (/[^0-9.]/.test(value)) {
                handleError("Positive numbers only! Letters are not allowed");
                return;
            } else if ((value.match(/\./g) || []).length > 1) {
                handleError("Please ensure the input contains at most one decimal point");
                return;
            } else if (value.includes(".")) {
                const decimalPlaces = value.split(".")[1];
                if (decimalPlaces && decimalPlaces.length > 1) {
                    handleError("Ensure the number contains only one digit after the decimal point");
                    return;
                }
            }
        }

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

        if(editData.supplierPhone){
            // التحقق من صحة رقم الهاتف
            if (!handlePhoneValidation(editData.supplierPhone)) {
                return;
            }
        }
        try {
            const url = `http://localhost:8080/auth/supplier/update-profile`;
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
                    navigate("/supplier/concrete/profile");
                }, 500);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError(err);
        }
    }

    const fetchSupplierData = async () => {
        try {
            const url = `http://localhost:8080/auth/supplier/supplier-data`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                }
            }
            const response = await fetch(url, headers);
            const result = await response.json();
            setSupplierData(result);
        } catch (err) {
            handleError(err);
        }
    }
    
    useEffect(() => {
        fetchSupplierData();
    }, []);

    return(
        <section className={styles.editProfileBody}>
            <Navbar 
                two="Orders"
                two1="Under preparing orders"
                pathTwo1="/supplier/concrete/under-preparing-orders"
                two2="Pending orders"
                pathTwo2="/supplier/concrete/pending-orders"
                two3="Old orders"
                pathTwo3="/supplier/concrete/old-orders"
                four="Profile"
                pathFour="/supplier/concrete/profile"
                logout={handleLogout}
            />
            
            {supplierData ? (
                <div className={styles.editProfileContainer}>
                    <div className={styles.editProfileRow}>
                        <h1 className={styles.editProfileH1}>Edit profile</h1>
                        <form className={styles.editProfileForm} onSubmit={handleUpdateProfile}>
                            <div className={styles.editProfileDiv}>
                                <label className={styles.editProfileLabel} htmlFor='supplierPhone'><strong>Change the phone number:</strong></label>
                                <input
                                    className={styles.editProfileInput}
                                    onChange= {handleChange}
                                    onKeyPress={handleKeyPress}
                                    onBlur={(e) => handlePhoneValidation(e.target.value)}
                                    type='tel'
                                    name='supplierPhone' 
                                    inputMode="numeric" 
                                    maxLength="10"
                                    placeholder= {supplierData.supplierPhone}
                                    value={editData.supplierPhone}
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
            ) : (
                <div className={styles.editProfileContainer}>
                    <div className={styles.loader}></div>
                </div>
            )}

            <Footer 
                two="Orders"
                two1="Under preparing orders"
                pathTwo1="/supplier/concrete/under-preparing-orders"
                two2="Pending orders"
                pathTwo2="/supplier/concrete/pending-orders"
                two3="Old orders"
                pathTwo3="/supplier/concrete/old-orders"
                four="Profile"
                pathFour="/supplier/concrete/profile"
                logout={handleLogout}
            />
            <ToastContainer />
        </section>
    );
}

export { EditProfile };