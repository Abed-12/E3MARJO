import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import styles from './OldOrders.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import Footer from '../../../../components/footer/Footer';
import OrderFilter from '../../../../components/orderFilter/OrderFilter';
import OrderTable from '../../../../components/orderTable/OrderTable';

function OldOrders() {
    const [filteredOrders, setFilteredOrders] = useState(null);

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

    // Function to handle the filtering logic
    const handleFilter = async (filterData) => {
        try {
            const response = await fetch(`http://localhost:8080/auth/supplier/order-data?statuses=${filterData.selectedStatus}&type=${filterData.type}&supplierID=${filterData.supplierID}&fromDate=${filterData.fromDate}&toDate=${filterData.toDate}`, {
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

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const statuses = "delivered,rejected";
                const url = `http://localhost:8080/auth/supplier/order-data?statuses=${statuses}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                const result = await response.json();
                setFilteredOrders(result);
            } catch (err) {
                handleError(err);
            }
        }
        fetchOrderData();
    }, []);

    return(
        <section className={styles.oldOrdersBody}>
            <Navbar 
                two="Orders"
                two1="Under preparing orders"
                pathTwo1="/supplier/cement/under-preparing-orders"
                two2="Pending orders"
                pathTwo2="/supplier/cement/pending-orders"
                two3="Old orders"
                pathTwo3="/supplier/cement/old-orders"
                four="Profile"
                pathFour="/supplier/cement/profile"
                logout={handleLogout}
            />

            <OrderFilter user='supplier' statuses={['delivered', 'rejected']} onFilter={handleFilter} />
            
            <div className={styles.oldOrdersTitle}>
                <h2 className={styles.oldOrdersH2}>Old Orders</h2>
            </div>
            {filteredOrders ? (
                <div className={styles.oldOrdersContainer}>
                    {filteredOrders.length > 0 ? (
                        <OrderTable filteredOrders={filteredOrders} />
                    ) : (
                        <p className={styles.oldOrdersP}>No old orders found</p>
                    )}
                </div>
            ) : (
                <div className={styles.oldOrdersLoader}>
                    <div className={styles.loader}></div>
                </div>
            )}

            <Footer 
                two="Orders"
                two1="Under preparing orders"
                pathTwo1="/supplier/cement/under-preparing-orders"
                two2="Pending orders"
                pathTwo2="/supplier/cement/pending-orders"
                two3="Old orders"
                pathTwo3="/supplier/cement/old-orders"
                four="Profile"
                pathFour="/supplier/cement/profile"
                logout={handleLogout}
            />
            <ToastContainer />
        </section>
    );
}

export { OldOrders };