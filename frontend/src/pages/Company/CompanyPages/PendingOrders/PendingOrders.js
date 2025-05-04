import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import styles from './PendingOrders.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import Footer from '../../../../components/footer/Footer';
import OrderFilter from '../../../../components/orderFilter/OrderFilter';
import OrderTable from '../../../../components/orderTable/OrderTable';


function PendingOrders() {
    const [filteredOrders, setFilteredOrders] = useState(null);

    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/company-login');
        }, 500)
    }    

    // Function to handle the filtering logic
    const handleFilter = async (filterData) => {
        try {
            const statuses = "pending";
            const response = await fetch(`http://localhost:8080/auth/company/order-data?statuses=${statuses}&type=${filterData.type}&supplierID=${filterData.supplierID}&fromDate=${filterData.fromDate}&toDate=${filterData.toDate}`, {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                }
            });
            const result = await response.json();
            setFilteredOrders(result); // Store the filtered orders
        } catch (err) {
            console.error('Error fetching filtered orders:', err);
        }
    };

    const fetchOrderData = async () => {
        try {
            const statuses = "pending";
            const url = `http://localhost:8080/auth/company/order-data?statuses=${statuses}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            const result = await response.json();
            setFilteredOrders(result); // Initialize filteredOrders with all data
        } catch (err) {
            handleError(err);
        }
    }
    
    useEffect(() => {
        fetchOrderData();
    }, []);

    return(
        <section className={styles.PendingOrdersBody}>
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
            
            <OrderFilter user='company' onFilter={handleFilter} />

            <div className={styles.pendingOrdersTitle}>
                <h2 className={styles.pendingOrdersH2}>Pending Orders</h2>
            </div>

            {filteredOrders ? (
                <div className={styles.pendingOrdersContainer}>
                    {filteredOrders.length > 0 ? (
                        <OrderTable filteredOrders={filteredOrders} />
                    ) : (
                        <p className={styles.pendingOrdersP}>No pending orders found</p>
                    )}
                </div>
            ) : (
                <div className={styles.pendingOrdersLoader}>
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

export { PendingOrders };