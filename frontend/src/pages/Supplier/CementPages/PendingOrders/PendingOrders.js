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
    const [filteredOrders, setFilteredOrders] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);  // لعرض صندوق النص
    const [rejectReason, setRejectReason] = useState('');  // لتخزين السبب المدخل
    const [currentOrderId, setCurrentOrderId] = useState(null);  // لتخزين id الطلب الحالي

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

    const orderAccepted = async (id) => {
        try{
            const data = {
                "id": id,
                "status": "under_preparing"
            }
            const url = 'http://localhost:8080/auth/supplier/update-order-status';
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message + "Order has been accepted");
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            fetchOrderData();
        } catch (error) {
            handleError('Error dropping order:', error);
        }
    }

    const orderRejected = async (id) => {
        try{
            if (!rejectReason) {
                handleError('Please provide a reason for rejection');
                return;
            }
            const data = {
                "id": currentOrderId,
                "status": "rejected",
                "rejectReason": rejectReason
            }
            const url = 'http://localhost:8080/auth/supplier/update-order-status';
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message + "Order has been rejected");
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            fetchOrderData();
            setShowRejectModal(false);
        } catch (error) {
            handleError('Error dropping order:'+ error);
        }
    }

    // Function to handle the filtering logic
    const handleFilter = async (filterData) => {
        try {
            const statuses = "pending";
            const response = await fetch(`http://localhost:8080/auth/supplier/order-data?statuses=${statuses}&type=${filterData.type}&supplierID=${filterData.supplierID}&fromDate=${filterData.fromDate}&toDate=${filterData.toDate}`, {
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
            const url = `http://localhost:8080/auth/supplier/order-data?statuses=${statuses}`;
            const response = await fetch(url, {
                method: "GET",
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

    useEffect(() => {
        fetchOrderData();
    }, []);

    return(
        <section className={styles.PendingOrdersBody}>
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

            <OrderFilter user='supplier' onFilter={handleFilter} />
            
            <div className={styles.pendingOrdersTitle}>
                <h2 className={styles.pendingOrdersH2}>Pending Orders</h2>
            </div>
            {filteredOrders ? (
                <div className={styles.pendingOrdersContainer}>
                    {filteredOrders && filteredOrders.length > 0 ? (
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
                                    <button className={styles.pendingOrdersButtonAccept} onClick={() => orderAccepted(order.id)}>Accept</button>
                                    <button className={styles.pendingOrdersButtonReject} onClick={() => { setShowRejectModal(true); setCurrentOrderId(order.id); }}>Reject</button>
                                </div>
                                {showRejectModal && (
                                    <div className={styles.rejectModalDiv}>
                                        <h3 className={styles.rejectModalH3}>Enter rejection reason</h3>
                                        <textarea
                                            className={styles.rejectModalTextarea}
                                            value={rejectReason}
                                            rows={4}
                                            maxLength={500}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            placeholder="Enter reason for rejection"
                                        />
                                        <div className={styles.textareaCharacterCount}>
                                            <p>{rejectReason.length} / 500 characters</p> {/* Character counter */}
                                        </div>
                                        <button className={styles.rejectModalButtonCancel} onClick={() => setShowRejectModal(false)}>Cancel</button>
                                        <button className={styles.rejectModalButtonSubmit} onClick={orderRejected}>Submit</button>
                                    </div>
                                )}
                            </div>
                        ))
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

export { PendingOrders };