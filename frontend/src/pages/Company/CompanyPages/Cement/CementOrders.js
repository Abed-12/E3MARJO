import React, { useEffect, useState } from 'react'
import { handleError, handleSuccess } from '../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './CementOrders.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import Footer from '../../../../components/footer/Footer';

function CementOrders() {
    const [dataSupplier, setDataSupplier] = useState(null);
    const [inputValue, setInputValue] = useState({
        supplierName: '',
        amountOfCement: '',
        price: ''
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
    
        if (name === 'supplierName') {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const supplierPrice = selectedOption.getAttribute('data-price') || '';
            setInputValue((prev) => ({
                ...prev,
                supplierName: value,
                price: supplierPrice, // update price
            }));
            return;
        }

        // check just amountOfCement
        if (name === "amountOfCement") {
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
                if (decimalPlaces && decimalPlaces.length > 2) {
                    handleError("Ensure the number contains only two digits after the decimal point");
                    return;
                }
            }
        }
    
        setInputValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        
        // Check if the select field is empty
        if (!inputValue.supplierName) {
            handleError("Please select a supplier name");
            return;
        }
        
        // Check if the input field is empty
        if (!inputValue.amountOfCement) {
            handleError("Please enter the required quantity of cement");
            return;
        }

        setTimeout(() => { 
            navigate(`/company/home/cement-order/cement-bill?supplierName=${inputValue.supplierName}&amountOfCement=${inputValue.amountOfCement}&price=${inputValue.price}`) // (function) سيتم تنفيذها بعد انتهاء الوقت
        }, 500)
    }

    useEffect(() => {
        const fetchDataSupplier = async () => {
            try {
                const supplierProduct= 'cement'
                const url = `http://localhost:8080/auth/company/data-supplier?supplierProducts=${supplierProduct}`;
                const headers = {
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                    }
                }
                const response = await fetch(url, headers);
                const result = await response.json();
                console.log(result);
                setDataSupplier(result); 
            } catch (err) {
                handleError(err);
            }
        }
        fetchDataSupplier();
    }, []);
    
    return(
        <section className={styles.profileBody}>
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

            {dataSupplier ? (
                <div className={styles.cementOrderContainer}>
                    <div className={styles.cementOrderRow}>
                        <h1 className={styles.cementOrderH1}>Cement Order</h1>
                        <form className={styles.cementOrderForm} onSubmit= {handleCheckout}>
                            <div className={styles.cementOrderDiv}>
                                <label className={styles.cementOrderLabel} htmlFor='supplierName'>Supplier Name</label>
                                <select
                                    className={styles.cementOrderSelect}
                                    name="supplierName" 
                                    onChange={handleChange}
                                    value={inputValue.supplierName} 
                                >
                                    <option value="">Select Supplier</option>
                                    {dataSupplier.map((supplier, index) => (
                                        <option key={index} value={supplier.supplierName} data-price={supplier.price}>
                                            {supplier.supplierName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.cementOrderDiv}>
                                <label className={styles.cementOrderLabel} htmlFor='amountOfCement'>Enter the required amount of Cement in ton</label>
                                <input
                                    className={styles.cementOrderInput}
                                    onChange= {handleChange}
                                    type='text'
                                    name='amountOfCement' 
                                    placeholder='Enter the required amount of Cement in ton...'
                                    value={inputValue.amountOfCement}
                                    autoFocus
                                />
                            </div>
                            <div className={styles.cementOrderDiv}>
                                <p className={styles.cementOrderP}>20 bags of Cement equals 1 ton</p>
                            </div>
                            <button className={styles.cementOrderButton} type='submit'>Checkout</button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className={styles.cementOrderContainer}>
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
                pathThree="/company/home/cement-order"
                four="Concrete"
                pathFour="/company/home/concrete-order"
                five="Profile"
                pathFive="/company/home/profile"
                logout={handleLogout}
            />
            <ToastContainer />
        </section>
    );
}
export default CementOrders;