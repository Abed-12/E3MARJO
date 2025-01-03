import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import styles from './ExpressOrders.module.css';
import Navbar from '../../../../../components/navbar/Navbar';
import Footer from '../../../../../components/footer/Footer';

function ExpressOrders() {
    const [dataSupplier, setDataSupplier] = useState(null);
    const [selectedSupplierStrengths, setSelectedSupplierStrengths] = useState({});
    const [inputValue, setInputValue] = useState({
        supplierName: '',
        amountOfConcrete: '',
        concreteStrength: '',
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

    // تعديل handleChange
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'supplierName') {
            setInputValue((prev) => ({
                ...prev,
                supplierName: value,
                concreteStrength: '', // إعادة تعيين القوة عند تغيير المورد
                price: '', // إعادة تعيين السعر
            }));

            // تحديث قوة الكسر والسعر بناءً على المورد
            const selectedSupplier = dataSupplier.find(
                (supplier) => supplier.supplierName === value
            );
            setSelectedSupplierStrengths(selectedSupplier ? selectedSupplier.concreteStrength : {}); // إذا لم يتم العثور على المورد، عيّن كائن فارغ
            return;
        }

        if (name === 'concreteStrength') {
            const price = selectedSupplierStrengths[value] || ''; // الحصول على السعر بناءً على قوة الكسر
            setInputValue((prev) => ({
                ...prev,
                concreteStrength: value,
                price: price, // تحديث السعر المرتبط
            }));
            return;
        }

        if (name === 'amountOfConcrete') {
            if (/[^0-9]/.test(value)) { // السماح فقط بالأرقام الصحيحة
                handleError("Positive integers only! Letters, symbols, and decimals are not allowed");
                return;
            } 
            if (!/^\d{0,3}$/.test(value)) { // السماح فقط بالأرقام من 1 إلى 3 خانات
                handleError("Enter a valid number, no more than 3 digits");
                return;
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
        if (!inputValue.concreteStrength) {
            handleError("Please select the required cement breaking strength");
            return;
        }

        // Check if the input field is empty
        if (!inputValue.amountOfConcrete) {
            handleError("Please enter the required quantity of concrete");
            return;
        }

        setTimeout(() => {
            navigate(`/company/home/concrete-orders/express-orders/express-bill?supplierName=${inputValue.supplierName}&amountOfConcrete=${inputValue.amountOfConcrete}&concreteStrength=${inputValue.concreteStrength}&price=${inputValue.price}`) // (function) سيتم تنفيذها بعد انتهاء الوقت
        }, 500)
    }

    useEffect(() => {
        const fetchDataSupplier = async () => {
            try {
                const supplierProduct= 'concrete'
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
                console.log(result)
            } catch (err) {
                handleError(err);
            }
        }
        fetchDataSupplier();
    }, []);
    

    return(
        <section className={styles.expressOrdersBody}>
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
                <div className={styles.expressOrderContainer}>
                    <div className={styles.expressOrderRow}>
                        <h1 className={styles.expressOrderH1}>Express Order</h1>
                        <form className={styles.expressOrderForm} onSubmit= {handleCheckout}>
                            <div className={styles.expressOrderDiv}>
                                <label className={styles.expressOrderLabel} htmlFor='supplierName'>Supplier Name</label>
                                <select
                                    className={styles.expressOrderSelect}
                                    name="supplierName" 
                                    onChange={handleChange}
                                    value={inputValue.supplierName} 
                                >
                                    <option value="">Select Supplier</option>
                                    {dataSupplier.map((supplier, index) => (
                                        <option key={index} value={supplier.supplierName}>
                                            {supplier.supplierName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.expressOrderDiv}>
                                <label className={styles.expressOrderLabel} htmlFor="concreteStrength">
                                    Cement breaking strength
                                </label>
                                <select
                                    className={styles.expressOrderSelect}
                                    name="concreteStrength"
                                    onChange={handleChange}
                                    value={inputValue.concreteStrength}
                                    disabled={!inputValue.supplierName}
                                >
                                    <option value="">Select Strength</option>
                                    {Object.entries(selectedSupplierStrengths).map(([strength, price], index) => (
                                        <option key={index} value={strength}>
                                            Strength {strength}: {price} JD
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.expressOrderDiv}>
                                <label className={styles.expressOrderLabel} htmlFor='amountOfConcrete'>Enter the required amount of Concrete in m³</label>
                                <input
                                    className={styles.expressOrderInput}
                                    onChange= {handleChange}
                                    type='text'
                                    name='amountOfConcrete' 
                                    placeholder='Enter the required amount of Concrete in m³...'                                
                                    value={inputValue.amountOfConcrete}
                                    autoFocus
                                />
                            </div>
                            <button className={styles.expressOrderButton} type='submit'>Checkout</button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className={styles.expressOrderContainer}>
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

export default ExpressOrders;