import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import { handleError, handleSuccess } from '../../../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import styles from './ExpressBill.module.css';
import Navbar from '../../../../../../components/navbar/Navbar';
import Footer from '../../../../../../components/footer/Footer';
import moment from 'moment';
import BackButtonHandler from '../../../../../../components/backButtonHandler/BackButtonHandler';

function ExpressBill() {

    const token = localStorage.getItem("token");
    const decodedData = jwtDecode(token);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const supplierName = queryParams.get('supplierName');
    const amountOfConcrete = queryParams.get('amountOfConcrete');
    const concreteStrength = queryParams.get('concreteStrength');
    const price = queryParams.get('price');

    const [companyData, setCompanyData] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [expressBillInfo, setExpressBillInfo] = useState({
        type: 'concrete',
        recipientName: '',
        recipientPhone: '',
        location: '',
        deliveryTime: '',
        orderRequestTime: moment().unix(),
        concreteStrength: { [concreteStrength]: parseInt(price) },
        concreteQuantity: amountOfConcrete,
        price: (amountOfConcrete * price).toFixed(2),
        supplierName: supplierName,
        note: ''
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
        const copyExpressBillInfo = { ...expressBillInfo };
        copyExpressBillInfo[name] = value;
        setExpressBillInfo(copyExpressBillInfo);
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
    
    const handleExpressBill = async (e) => {
        e.preventDefault();
        // تحديد الحقول المطلوبة
        const requiredFields = ['recipientName', 'recipientPhone', 'location', 'deliveryTime'];

        // التحقق من وجود الحقول المطلوبة
        const missingFields = requiredFields.filter(field => !expressBillInfo[field]);
        
        if (missingFields.length > 0) {
            return handleError(`The following fields are required: ${missingFields.join(', ')}`);
        }
        
        // التحقق من صحة رقم الهاتف
        if (!handlePhoneValidation(expressBillInfo.recipientPhone)) {
            return;
        }
        
        // Format deliveryTime using moment
        const formattedDeliveryTime = moment(expressBillInfo.deliveryTime).unix();
        const expressBillData = {
            ...expressBillInfo,
            deliveryTime: formattedDeliveryTime, // Update deliveryTime format
        };
        
        try { 
            const url = `http://localhost:8080/auth/supplier/concrete-order`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expressBillData)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/company/home/pending-orders')
                }, 500)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (error) {
            handleError(error);
        }
    }

    useEffect(() => {
        const updateCurrentDateTime = () => {
            const now = moment().format('YYYY-MM-DDTHH:mm'); 
            setCurrentDateTime(now);
        };

        updateCurrentDateTime();
        const interval = setInterval(updateCurrentDateTime, 60000); // Update every 1 minute
        
        return () => clearInterval(interval); // Clear interval on unmount  
    }, []);

    // Warning on page reload or leave 
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const message = 'Are you sure you want to leave?';
            event.returnValue = message; // Standard for most browsers
        };  

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);  

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
            setCompanyData(result);
        } catch (err) {
            handleError(err);
        }
    }
        
    useEffect(() => {
        fetchCompanyData();
    }, []);

    return(
        <section className={styles.expressBillBody}>
            <Navbar 
                confirmationRequired="true"
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
            
            <BackButtonHandler />

            {companyData ? (
                <div className={styles.expressBillContainer}>
                    <div className={styles.expressBillRow}>
                        <h1 className={styles.expressBillH1}>Express Bill</h1>
                        <form className={styles.expressBillForm} onSubmit={handleExpressBill} >
                            <div className={styles.expressBillDiv}>
                                <p className={styles.expressBillP}><strong>Company name:</strong> {decodedData.companyName}</p>
                            </div>
                            <div className={styles.expressBillDiv}>
                                <p className={styles.expressBillP}><strong>Company phone:</strong> {companyData.companyPhone}</p>
                            </div>
                            <div className={styles.expressBillDiv}>
                                <label className={styles.expressBillLabel} htmlFor='recipientName'><strong>Recipient's name</strong></label>
                                <input
                                    className={styles.expressBillInput}
                                    onChange={handleChange}
                                    type='text'
                                    name='recipientName'
                                    placeholder="Enter the recipient's name"
                                    value={expressBillInfo.recipientName}
                                    autoFocus
                                />
                            </div>
                            <div className={styles.expressBillDiv}>
                                <label className={styles.expressBillLabel} htmlFor='recipientPhone'><strong>Recipient's phone</strong></label>
                                <input
                                    className={styles.expressBillInput}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    onBlur={(e) => handlePhoneValidation(e.target.value)}
                                    type='tel'
                                    name='recipientPhone'
                                    inputMode="numeric" 
                                    maxLength="10"
                                    placeholder="Enter the recipient's phone"
                                    value={expressBillInfo.recipientPhone}
                                />
                            </div>
                            <div className={styles.expressBillDiv}>
                                <label className={styles.expressBillLabel} htmlFor='location'><strong>Location</strong></label>
                                <input
                                    className={styles.expressBillInput}
                                    onChange={handleChange}
                                    type='text'
                                    name='location'
                                    placeholder='ex:Governorate/City/Area/Neighborhood/Street Name'
                                    value={expressBillInfo.location}
                                />
                            </div>
                            <div className={styles.expressBillDiv}>
                                <label className={styles.expressBillLabel} htmlFor='deliveryTime'><strong>Delivery time</strong></label>
                                <input
                                    className={styles.expressBillInputTime}
                                    onChange={handleChange}
                                    type='datetime-local'
                                    name='deliveryTime'
                                    min={currentDateTime}
                                    value={expressBillInfo.deliveryTime}
                                />
                            </div>
                            <div className={styles.expressBillDiv}>
                                <p className={styles.expressBillP}><strong>Concrete strength:<br /></strong> {concreteStrength} </p> 
                            </div>
                            <div className={styles.expressBillDiv}>
                                <p className={styles.expressBillP}><strong>Price per m³:<br /></strong> {price} JD</p> 
                            </div>
                            <div className={styles.expressBillDiv}>
                                <p className={styles.expressBillP}><strong>Quantity:<br /></strong> {amountOfConcrete} m³</p> 
                            </div>
                            <div className={styles.expressBillDiv}>
                                <p className={styles.expressBillP}><strong>Total price:<br /></strong> {(amountOfConcrete * price).toFixed(2)} JD</p>
                            </div>
                            <div className={styles.expressBillDiv}>
                                <p className={styles.expressBillP}><strong>Supplier name:<br /></strong> {supplierName} </p>
                            </div>
                            <div className={styles.expressBillDiv}>
                                <p className={styles.expressBillP}><strong>Concrete mixer count:<br /></strong> {Math.ceil(amountOfConcrete / 8) } </p>
                            </div>
                            <div className={styles.expressBillDivTextarea}>
                                <p className={styles.expressBillP}><strong>Enter note: </strong></p>
                                <textarea
                                    className={styles.expressBillTextarea}
                                    value={expressBillInfo.note}
                                    onChange={handleChange}
                                    placeholder="Enter note"
                                    name="note"
                                    rows={4}
                                    maxLength={500} // Optional: Set character limit
                                />
                                <div className={styles.textareaCharacterCount}>
                                    <p>{expressBillInfo.note.length} / 500 characters</p> {/* Character counter */}
                                </div>
                            </div>
                            <button className={styles.expressBillButton} type='submit'>Confirm Order</button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className={styles.expressBillContainer}>
                    <div className={styles.loader}></div>
                </div>
            )}

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

export default ExpressBill;