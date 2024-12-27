import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import styles from './PendingOrders.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import Footer from '../../../../components/footer/Footer';
import OrderFilter from '../../../../components/orderFilter/OrderFilter';
import moment from 'moment';

function PendingOrders() {
    const [filteredOrders, setFilteredOrders] = useState([]);

    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/company-login');
        }, 500)
    }    

    const orderDelete= async (orderId) => {
        try{
            const response = await fetch(`http://localhost:8080/auth/company/order-delete/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
            });
            const result = await response.json();
            const { success, message } = result;
            if (success) {
                handleSuccess(message + "Order has been deleted");
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
            fetchOrderData();
        } catch (error) {
            handleError('Error dropping order:', error);
        }
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
                pathThree="/company/home/cement-order"
                four="Concrete"
                pathFour="/company/home/concrete-order"
                five="Profile"
                pathFive="/company/home/profile"
                logout={handleLogout}
            />
            
            <OrderFilter user='company' onFilter={handleFilter} />

            <div className={styles.pendingOrdersTitle}>
                <h2 className={styles.pendingOrdersH2}>Pending Orders</h2>
            </div>
            <div className={styles.pendingOrdersContainer}>
                {filteredOrders  && filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                        <div className={styles.pendingOrdersRow} key={index}>
                            <p className={`${styles.pendingOrdersData} ${styles.pendingOrdersSupplierName}`}>
                                <strong>Supplier name:</strong> {order.supplierName}
                            </p>
                            <div className={styles.pendingOrdersDiv}>
                                <p className={`${styles.pendingOrdersData} ${styles.pendingOrdersStatus}`}>
                                    <strong>Order status:</strong> {order.status}
                                </p>
                                <p className={`${styles.pendingOrdersData} ${styles.pendingOrdersType}`}>
                                    <strong>Order type:</strong> {order.type}
                                </p>
                            </div>
                            <hr />
                            <div className={styles.pendingOrdersDiv}>
                                <p className={styles.pendingOrdersData}>
                                    <strong>Company name:</strong> {order.companyName}
                                </p>
                                <p className={styles.pendingOrdersData}>
                                    <strong>Company phone:</strong> {order.companyPhone}
                                </p>
                                <p className={styles.pendingOrdersData}>
                                    <strong>Recipient's name:</strong> {order.recipientName}
                                </p>
                                <p className={styles.pendingOrdersData}>
                                    <strong>Recipient's phone:</strong> {order.recipientPhone}
                                </p>
                                <p className={styles.pendingOrdersData}>
                                    <strong>Delivery time:</strong> {moment(order.deliveryTime * 1000).format('D/MM/YYYY - h:mm a')}
                                </p>
                                <p className={styles.pendingOrdersData}>
                                    <strong>Location:</strong> {order.location}
                                </p>
                            </div>
                            <div className={styles.pendingOrdersDiv}>
                                <p className={styles.pendingOrdersData}>
                                    <strong>Cement quantity:</strong> {order.cementQuantity} ton
                                </p>
                                <p className={styles.pendingOrdersData}>
                                    <strong>Number of cement bags:</strong> {order.cementNumberBags}
                                </p>
                                <p className={styles.pendingOrdersData}>
                                    <strong>Cement price:</strong> {order.price} JD
                                </p>
                                <p className={styles.pendingOrdersData}>
                                    <strong>Order request time:</strong> {moment(order.orderRequestTime * 1000).format('D/MM/YYYY - h:mm a')}
                                </p>
                            </div>
                            <div className={styles.pendingOrdersDivButton}>
                                <button className={styles.pendingOrdersButtonDeleted} onClick={() => orderDelete(order.id)}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.pendingOrdersP}>No pending orders found</p>
                )}
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

export { PendingOrders };