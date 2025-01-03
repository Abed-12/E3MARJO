import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import { handleError, handleSuccess } from '../../../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import styles from './CustomOrderBill.module.css';
import Navbar from '../../../../../../components/navbar/Navbar';
import Footer from '../../../../../../components/footer/Footer';
import moment from 'moment';

function CustomBill() {
    const token = localStorage.getItem("token");
    const decodedData = jwtDecode(token);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const supplierName = queryParams.get('supplierName');
    const totalPrice = queryParams.get('totalPrice');
    const totalQuantity = queryParams.get('totalQuantity');
    const selectedStrengths = queryParams.get('selectedStrengths').split(',');
    const strengthKeys = selectedStrengths.map(strength => strength.split(': ')[0]);
    const prices = queryParams.get('prices')?.split(',') || [];
    const priceValues = prices.map(price => price.trim()); // Remove any whitespace

    const [companyData, setCompanyData] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [customBillInfo, setCustomBillInfo] = useState({
        type: 'concrete',
        recipientName: '',
        recipientPhone: '',
        location: '',
        deliveryTime: '',
        orderRequestTime: moment().unix(),
        concreteStrength: selectedStrengths.reduce((acc, strength) => {
            const [key, value] = strength.split(': ');
            acc[key] = parseInt(value);
            return acc;
        }, {}),
        StrengthPrices:priceValues.reduce((acc, price, index) => {
            acc[strengthKeys[index]] = parseFloat(price);
            return acc;
        }, {}),
        concreteQuantity: totalQuantity,
        price: parseFloat(totalPrice).toFixed(2),
        supplierName: supplierName,
        note: ''
    });

    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/company-login');
        }, 500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copyCustomBillInfo = { ...customBillInfo };
        copyCustomBillInfo[name] = value;
        setCustomBillInfo(copyCustomBillInfo);
    };

    const handleKeyPress = (e) => {
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
            handleError('Numbers only! Letters are not allowed');
        }
    };

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
    const handleCustomBill = async (e) => {
        e.preventDefault();
        const requiredFields = ['recipientName', 'recipientPhone', 'location', 'deliveryTime'];
        const missingFields = requiredFields.filter(field => !customBillInfo[field]);
        
        if (missingFields.length > 0) {
            return handleError(`The following fields are required: ${missingFields.join(', ')}`);
        }
        
        if (!handlePhoneValidation(customBillInfo.recipientPhone)) {
            return;
        }
        
        const formattedDeliveryTime = moment(customBillInfo.deliveryTime).unix();
        const customBillData = {
            ...customBillInfo,
            deliveryTime: formattedDeliveryTime,
        };
        
        try {
            // Fixed URL to match router endpoint
            const url = `http://localhost:8080/auth/supplier/concrete-order`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`, // Fixed token format
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customBillData)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                handleSuccess(result.message);
                setTimeout(() => {
                    navigate('/company/home/pending-orders');
                }, 500);
            } else {
                handleError(result.message || 'An error occurred while processing your order');
            }
        } catch (error) {
            console.error('Error details:', error);
            handleError(error.message || 'Failed to submit order');
        }
    };

    useEffect(() => {
        const updateCurrentDateTime = () => {
            const now = moment().format('YYYY-MM-DDTHH:mm');
            setCurrentDateTime(now);
        };

        updateCurrentDateTime();
        const interval = setInterval(updateCurrentDateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const message = 'Are you sure you want to leave?';
            event.returnValue = message;
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
            };
            const response = await fetch(url, headers);
            const result = await response.json();
            setCompanyData(result);
        } catch (err) {
            handleError(err);
        }
    };
        
    useEffect(() => {
        fetchCompanyData();
    }, []);

    return (
<section className={styles.customBillBody}>
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
    
    {companyData ? (
        <div className={styles.customBillContainer}>
            <div className={styles.customBillRow}>
            <h1 className={styles.customBillH1}>Custom Bill</h1>
            <form className={styles.customBillForm} onSubmit={handleCustomBill}>
                <div className={styles.customOrdersDiv}>
                    <p className={styles.customOrdersP}><strong>Company name:</strong> {decodedData.companyName}</p>
                </div>
                <div className={styles.customOrdersDiv}>
                    <p className={styles.customOrdersP}><strong>Company phone:</strong> {companyData.companyPhone}</p>
                </div>
                <div className={styles.customOrdersDiv}>
                    <label className={styles.customOrdersLabel} htmlFor='recipientName'><strong>Recipient's name</strong></label>
                    <input
                        className={styles.customOrdersInput}
                        onChange={handleChange}
                        type='text'
                        name='recipientName'
                        placeholder="Enter the recipient's name"
                        value={customBillInfo.recipientName}
                        autoFocus
                    />
                </div>
                <div className={styles.customOrdersDiv}>
                    <label className={styles.customOrdersLabel} htmlFor='recipientPhone'><strong>Recipient's phone</strong></label>
                    <input
                        className={styles.customOrdersInput}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        onBlur={(e) => handlePhoneValidation(e.target.value)}
                        type='tel'
                        name='recipientPhone'
                        inputMode="numeric"
                        maxLength="10"
                        placeholder="Enter the recipient's phone"
                        value={customBillInfo.recipientPhone}
                    />
                </div>
                <div className={styles.customOrdersDiv}>
                    <label className={styles.customOrdersLabel} htmlFor='location'><strong>Location</strong></label>
                    <input
                        className={styles.customOrdersInput}
                        onChange={handleChange}
                        type='text'
                        name='location'
                        placeholder='ex:Governorate/City/Area/Neighborhood/Street Name'
                        value={customBillInfo.location}
                    />
                </div>
                <div className={styles.customOrdersDiv}>
                    <label className={styles.customOrdersLabel} htmlFor='deliveryTime'><strong>Delivery time</strong></label>
                    <input
                        className={styles.customOrdersInputTime}
                        onChange={handleChange}
                        type='datetime-local'
                        name='deliveryTime'
                        min={currentDateTime}
                        value={customBillInfo.deliveryTime}
                    />
                </div>
                <div className={styles.customOrdersDiv}>
                    <p className={styles.customOrdersP}>
                        <strong>Concrete strengths:</strong><br />
                        {strengthKeys.map((strength, index) => (
                            <span key={index}>
                                {strength} <br />
                                <hr></hr>
                            </span>
                        ))}
                    </p>
                </div>
                <div className={styles.customOrdersDiv}>
                    <p className={styles.customOrdersP}>
                        <strong>Concrete prices:</strong><br />
                        {priceValues.map((value, index) => (
                            <span key={index}>
                                {value} <br />
                                <hr></hr>
                            </span>
                        ))}                    
                    </p>
                </div>

                <div className={styles.customOrdersDiv}>
                    <p className={styles.customOrdersP}>
                        <strong>Total quantity:</strong><br />
                        {totalQuantity} m³
                    </p>
                </div>
                <div className={styles.customOrdersDiv}>
                    <p className={styles.customOrdersP}>
                        <strong>Total price:</strong><br />
                        {parseFloat(totalPrice)} JD
                    </p>
                </div>
                <div className={styles.customOrdersDiv}>
                    <p className={styles.customOrdersP}>
                        <strong>Supplier name:</strong><br />
                        {supplierName}
                    </p>
                </div>
                <div className={styles.customOrdersDiv}>
                    <p className={styles.customOrdersP}>
                        <strong>Concrete mixer count:</strong><br />
                        {Math.ceil(totalQuantity / 8)}
                    </p>
                </div>
                <div className={styles.customOrdersDivTextarea}>
                    <p className={styles.customOrdersP}><strong>Enter note: </strong></p>
                    <textarea
                        className={styles.customOrdersTextarea}
                        value={customBillInfo.note}
                        onChange={handleChange}
                        placeholder="Enter note"
                        name="note"
                        rows={4}
                        maxLength={500}
                    />
                    <div className={styles.textareaCharacterCount}>
                        <p>{customBillInfo.note.length} / 500 characters</p>
                    </div>
                </div>
                <button className={styles.customOrdersButton} type='submit'>Confirm Order</button>
            </form>
            </div>
            </div>
    ) : (
        <div className={styles.customOrdersLoader}>
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

export default CustomBill;