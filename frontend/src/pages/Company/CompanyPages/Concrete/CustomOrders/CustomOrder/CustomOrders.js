import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import styles from './CustomOrders.module.css'; 
import Navbar from '../../../../../../components/navbar/Navbar';
import Footer from '../../../../../../components/footer/Footer';
import React, { useEffect, useState } from 'react';
import BackButtonHandler from "../../../../../../components/backButtonHandler/BackButtonHandler";

function CustomOrders() {
    const navigate = useNavigate();
    const [isCalculated, setIsCalculated] = useState(false);
    const [dataSupplier, setDataSupplier] = useState(null);
    const [rows, setRows] = useState([
        {
            name: '',
            number: '',
            length: '',
            width: '',
            height: '',
            quantity: '',
            price: 0,
            supplierName: '',
            breakingStrength: '',
            supplierPrice: 0,
            availableStrengths: [],
            totalPrice:0,
            totalQuantity:0,
        }
    ]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const handleGlobalSupplierChange = (value) => {
        const supplier = dataSupplier.find(s => s.supplierName === value);
        setSelectedSupplier(value);
        setIsCalculated(false);
        const updatedRows = rows.map((row) => ({
            ...row,
            supplierName: value,
            breakingStrength: '',
            availableStrengths: supplier ? supplier.concreteStrength : []
        }));
        setRows(updatedRows);
        
    };
    // fetch supplier data
    useEffect(() => {
        const fetchDataSupplier = async () => {
            try {
                const supplierProduct = 'concrete';
                const url = `http://localhost:8080/auth/company/data-supplier?supplierProducts=${supplierProduct}`;
                const headers = {
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                    }
                };
                const response = await fetch(url, headers);
                const result = await response.json();
                setDataSupplier(result);
            } catch (err) {
                handleError(err);
            }
        };
        fetchDataSupplier();
    }, []);
    
    const handleRowCountChange = (count) => {
        const newCount = parseInt(count) || 1;
        const supplier = dataSupplier.find(s => s.supplierName === selectedSupplier);
        // if (!selectedSupplier) {
        //     handleError('Please select a supplier before adding rows.');
        //     return;
        // }
        setIsCalculated(false);

        setRows(Array(newCount).fill(null).map(() => ({
            name: '',
            number: '',
            length: '',
            width: '',
            height: '',
            quantity: '',
            price: '',
            supplierName: selectedSupplier,
            breakingStrength: '',
            supplierPrice: 0,
            totalPrice:0,
            totalQuantity:0,
            availableStrengths: supplier ? supplier.concreteStrength : []
        })));
    };

    const calculateTotals = () => {
        let totalPrice = 0;
        let totalQuantity = 0;
        for (const row of rows) {
            if (row.price === 0) {
                setIsCalculated(false);
                return { totalPrice: 0, totalQuantity: 0 };
            }
            totalPrice += Math.ceil(parseFloat(row.price)) || 0;
            totalQuantity += Math.ceil(parseFloat(row.quantity)) || 0;
        }
        
        return { totalPrice, totalQuantity };
    };
    const calculateQuantitiesAndPrices = () => 
    {
        let totalQuantity=0;
        const updatedRows = rows.map
        ((row) => 
        {
            const length = parseFloat(row.length) || 0;
            const width = parseFloat(row.width) || 0;
            const height = parseFloat(row.height) || 0;
            const number = parseFloat(row.number) || 0;
            
            var quantity = Math.ceil((number * length * width * height));
            totalQuantity += parseFloat(quantity); // Add to totalQuantity

            let price = 0;
            if (row.breakingStrength && quantity > 0) {
                const priceValue = parseInt(row.breakingStrength.split(': ')[1]) || 0;
                price = (priceValue * quantity);
            }

            return {
                ...row,
                quantity,
                price,
                totalPrice: parseFloat(price) || 0,
                totalQuantity: parseFloat(quantity) || 0
            };
        });
        if(totalQuantity > 1000){  handleError('Total quantity cannot exceed 1000 m³');            }
        setRows(updatedRows);
        setIsCalculated(true);
    };
    // handle number filed and number of item accept only number, number less than 100
    const handleNumberOfInput = (e) => {
        const inputValue = e.target.value; // Current value of the input field
    
        // Allow only numbers
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault(); // Prevent input if it's not a number
            handleError('Numbers only allowed!');
            return;
        }
    
        // Prevent values greater than 100
        const newValue = parseFloat(inputValue + e.key);
        if (newValue > 100) {
            e.preventDefault(); // Prevent input if it exceeds 100
            handleError('Value must be less than 100!');
            return;
        }
    };
    // accept only number
    const handleQuantity = (e) => {
    
        // Allow only numbers
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault(); // Prevent input if it's not a number
            handleError('Numbers only allowed!');
            return;
        }
    };
 
    // accept tow decimal number,  prevent input if it's not a number, prevent input if it's more than 1000
    const handleLengtghHieghtWidth = (e) => { 
        const inputValue = e.target.value; // Current value of the input field
    
        // Prevent non-numeric characters except "."
        if (!/^[0-9.]$/.test(e.key)) {
            e.preventDefault();
            handleError('Numbers only allowed!');
            return;
        }
    
        // Prevent multiple decimal points
        if (e.key === '.' && inputValue.includes('.')) {
            e.preventDefault();
            handleError('Only one decimal point allowed!');
            return;
        }
    
        // Prevent more than two decimal places
        const [,decimalPart] = inputValue.split('.');
        if (decimalPart && decimalPart.length >= 2 && e.key !== 'Backspace') {
            e.preventDefault();
            handleError('Only two decimal places allowed!');
            return;
        }
    
        // Prevent input greater than 1000
        if (parseFloat(inputValue + e.key) > 1000) {
            e.preventDefault();
            handleError('Value cannot exceed 1000!');
            return;
        }
    };
    
    // update price after user update quantity
    const handleValueChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;

        // Reset calculation flag when breakingStrength is modified
        if (field === 'breakingStrength') {
            setIsCalculated(false);  
        }
    
        // If quantity is being changed, update the price
        if (field === 'quantity') {
            const quantity = parseFloat(value) || 0;
            if (newRows[index].breakingStrength) {
                const priceValue = parseFloat(newRows[index].breakingStrength.split(': ')[1]) || 0;
                newRows[index].price = priceValue * quantity;
            }
        }
    
        setRows(newRows);
    };
    
    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/company-login');
        }, 500);
    };  
    const checkoutOrder = (e)=>  {
        const priceArr =[]
        const selectedStrengths=[]
        rows.forEach(row => {
            if (row.breakingStrength) {
                const [strength, price] = row.breakingStrength.split(': ');
                if (!selectedStrengths.includes(strength)) {
                    selectedStrengths.push(strength);
                    priceArr.push(parseInt(price));
                }
            }
        });
        const totalQuantity = calculateTotals().totalQuantity;
        const totalPrice = calculateTotals().totalPrice;
        const supplierName = selectedSupplier;
        setTimeout(() => { 
            navigate(`/company/home/concrete-order/custom-order/custom-bill?supplierName=${supplierName}&totalPrice=${totalPrice}&totalQuantity=${totalQuantity}&selectedStrengths=${selectedStrengths}&prices=${priceArr}`)
        }, 500)
    }
    

    return (
        <section className={styles.customOrderBody}>
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

            {dataSupplier ? (
                <div className={styles.concreteTableContainer }>
                    <div className={styles.concretOrderRow}>
                        <div className={styles.numberOfInput}>
                            <input
                                type="text"
                                onChange={(e) => handleRowCountChange(e.target.value)}
                                className="border p-2 rounded"
                                onKeyPress={handleNumberOfInput}
                                min="1"
                                placeholder="Enter number of rows"
                            />
                            <select
                                value={selectedSupplier}
                                onChange={(e) => handleGlobalSupplierChange(e.target.value)}
                            >
                                <option value="">Select Supplier</option>
                                {dataSupplier.map((supplier) => {
                                    return (
                                        <option key={supplier.supplierName}>
                                            {supplier.supplierName}  {/* Display only the supplier name */}
                                        </option>
                                    );})}
                            </select>


                        </div>
                        <div className={styles.table}>
                        {rows.length > 0 && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Item name</th>
                                        <th>Concrete strength</th>
                                        <th>Number</th>
                                        <th>Length</th>
                                        <th>Width</th>
                                        <th>Height</th>
                                        <th>Quantity (m³)</th>
                                        <th>Price (JD)</th>
                                    </tr>
                                </thead>


                                <tbody>
                                    {rows.map((row, index) => (
                                        <tr key={index}>
                                            <td >
                                                <input
                                                    type="text"
                                                    value={row.name}
                                                    onChange={(e) => handleValueChange(index, 'name', e.target.value)}
                                                    className="w-full p-1"
                                                    placeholder="Enter name"
                                                />
                                            </td>
                                            <td >
                                            <select
                                                value={row.breakingStrength}
                                                onChange={(e) => handleValueChange(index, 'breakingStrength', e.target.value)}  // This will handle the change
                                                className="w-full p-1"
                                                disabled={!selectedSupplier}
                                            >
                                                <option value="">Select Strength</option>
                                                {row.availableStrengths &&
                                                    Object.entries(row.availableStrengths).map(([key, value]) => (
                                                        <option key={key} value={`${key}: ${value}`}>
                                                            {key}: {value} JD
                                                        </option>
                                                    ))}
                                            </select>

                                            </td>
                                            <td >
                                                <input
                                                    type="number"
                                                    value={row.number}
                                                    onKeyPress={handleNumberOfInput}
                                                    onChange={(e) => handleValueChange(index, 'number', e.target.value)}
                                                    className="w-full p-1"
                                                    placeholder="Number"
                                                    min="0"
                                                    max='100'
                                                    step="1"
                                                />
                                            </td>
                                            <td >
                                                <input
                                                    type="number"
                                                    value={row.length}
                                                    onChange={(e) => handleValueChange(index, 'length', e.target.value)}
                                                    className="w-full p-1"
                                                    placeholder="Length (m)"
                                                    onKeyPress={handleLengtghHieghtWidth}
                                                    min="0"
                                                    max='1000'
                                                    step="0.1"
                                                />
                                            </td>
                                            <td >
                                                <input
                                                    type="number"
                                                    value={row.width}
                                                    onChange={(e) => handleValueChange(index, 'width', e.target.value)}
                                                    className="w-full p-1"
                                                    placeholder="Width (m)"
                                                    onKeyPress={handleLengtghHieghtWidth}
                                                    min="0"
                                                    max='1000'

                                                    step="0.1"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={row.height}
                                                    onChange={(e) => handleValueChange(index, 'height', e.target.value)}
                                                    className="w-full p-1"
                                                    placeholder="Height (m)"
                                                    onKeyPress={handleLengtghHieghtWidth}
                                                    min="0"
                                                    max='1000'
                                                    step="0.1"
                                                />
                                            </td>
                                            <td >
                                                <input
                                                    type="number"
                                                    value={row.quantity}
                                                    onKeyPress={handleQuantity}
                                                    onChange={(e) => handleValueChange(index, 'quantity', e.target.value)}
                                                    className="w-full p-1"
                                                    placeholder="m³"
                                                    max='400'
                                                    step="1"

                                                
                                                />
                                            </td>
                                            <td >
                                                <input
                                                    type="text"
                                                    value={row.price}
                                                    className={styles.price}
                                                    placeholder="JD"
                                                    readOnly
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        </div>
                        <div className={styles.totalCount}>
                            <p> Total quantity: {isCalculated ? calculateTotals().totalQuantity : 0} </p>
                            <p> Total price: {   isCalculated ?   calculateTotals().totalPrice:0 } JD </p>
                        </div>

                        <div className={styles.concreteOrderButton}>
                            <button
                                className={styles.calculateButton} 
                                onClick={calculateQuantitiesAndPrices}
                            >
                                Calculate
                            </button>
                            
                            <button
                            className='{styles.checkouButton}'
                            onClick={checkoutOrder}
                            disabled={!isCalculated || calculateTotals().totalQuantity > 1000}
                            style={{ 
                                opacity: (isCalculated && calculateTotals().totalQuantity <= 1000) ? 1 : 0.5,
                                cursor: (isCalculated && calculateTotals().totalQuantity <= 1000) ? 'pointer' : 'not-allowed'
                            }}                    >
                                checkout
                            </button>


                        </div>
                        </div>
                    </div>
            ) : (
                <div className={styles.customOrderLoader}>
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

export default CustomOrders;