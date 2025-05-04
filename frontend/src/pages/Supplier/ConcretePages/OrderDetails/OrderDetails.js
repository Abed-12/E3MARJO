import React, { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../../../../utils/utils";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../../components/navbar/Navbar";
import Footer from "../../../../components/footer/Footer";
import styles from "./OrderDetails.module.css";

const OrderDetails = () => {
    const [orders, setOrders] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);  // لعرض صندوق النص
    const [orderId, setOrderId] = useState(null);  // لتخزين id الطلب الحالي
    const [rejectReason, setRejectReason] = useState('');  // لتخزين السبب المدخل

    const location = useLocation();
    const navigate = useNavigate();

    const { id } = location.state;

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('supplierProduct');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/supplier-login');
        }, 500)
    }

    // Accept button
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
                setTimeout(() => {
                    navigate('/supplier/concrete/pending-orders');
                }, 500);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (error) {
            handleError('Error dropping order:', error);
        }
    }

    // Reject button
    const orderRejected = async (id) => {
        try{
            if (!rejectReason) {
                handleError('Please provide a reason for rejection');
                return;
            }
            const data = {
                "id": orderId,
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
                setTimeout(() => {
                    navigate('/supplier/concrete/pending-orders');
                }, 500);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            setShowRejectModal(false);
        } catch (error) {
            handleError('Error dropping order:'+ error);
        }
    }

    // Completed button
    const orderCompleted = async (id) => {
        try{
            const data = {
                "id": id,
                "status": "completed"
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
                handleSuccess(message + 'Order has been completed');
                setTimeout(() => {
                    navigate('/supplier/concrete/under-preparing-orders');
                }, 500);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (error) {
            handleError('Error dropping order:', error);
        }
    }

    useEffect(() => {
        const fetchDataOrder = async () => {
            try {
                const url = `http://localhost:8080/auth/supplier/order-data/${id}`;
                const response = await fetch(url, {
                method: "GET",
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                const result = await response.json();
                setOrders(result);
            } catch (err) {
                handleError(err);
            }
        };
        fetchDataOrder();
    }, [id]);

    return (
        <section className={styles.orderBody}>
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
        
            <div className={styles.orderTitle}>
                <h2 className={styles.orderH2}>
                    {orders && (
                        `${orders.status === 'under_preparing' ? 'Under Preparing' : orders.status} Order Details`
                    )}
                </h2>
            </div>
        
            {orders ? (
                <div className={styles.orderContainer}>
                    <div className={styles.orderRow}> 
                        <p className={`${styles.orderData} ${styles.orderSupplierName}`}>
                            <strong>Supplier name:</strong> {orders.supplierName}
                        </p>
                        <div className={styles.orderDiv}>
                            <p className={`${styles.orderData} ${styles.orderStatus}`}>
                                <strong>Order status:</strong> {orders.status === 'under_preparing' ? 'under preparing' : orders.status}
                            </p>
                            <p className={`${styles.orderData} ${styles.orderType}`}>
                                <strong>Order type:</strong> {orders.type}
                            </p>
                        </div>
                        <hr />
                        <div className={styles.orderDiv}>
                            <p className={styles.orderData}>
                                <strong>Company name:</strong> {orders.companyName}
                            </p>
                            <p className={styles.orderData}>
                                <strong>Company phone:</strong> {orders.companyPhone}
                            </p>
                            <p className={styles.orderData}>
                                <strong>Recipient's name:</strong> {orders.recipientName}
                            </p>
                            <p className={styles.orderData}>
                                <strong>Recipient's phone:</strong> {orders.recipientPhone}
                            </p>
                            <p className={styles.orderData}>
                                <strong>Delivery time:</strong> {moment(orders.deliveryTime * 1000).format('D/MM/YYYY - h:mm a')}
                            </p>
                            <p className={styles.orderData}>
                                <strong>Location:</strong> {orders.location}
                            </p>
                        </div>
                        <div className={styles.orderDiv}>
                            <p className={styles.orderData}>
                                <strong>Concrete quantity:</strong> {orders.concreteQuantity} m³
                            </p>
                            <p className={styles.orderData}>
                                <strong>Concrete strength:</strong>{" "}
                                {Object.entries(orders.concreteStrength).map(([key], index, array) => (
                                    <span key={key}>
                                        {key}
                                        {index < array.length - 1 && " - "}
                                    </span>
                                ))}
                            </p>
                            <p className={styles.orderData}>
                                <strong>Concrete price:</strong> {orders.price} JD
                            </p>
                            <p className={styles.orderData}>
                                <strong>Order request time:</strong> {moment(orders.orderRequestTime * 1000).format('D/MM/YYYY - h:mm a')}
                            </p>
                            {orders.concreteNote && (
                                <p className={styles.orderData}>
                                    <strong>Note:</strong> {orders.concreteNote}
                                </p>
                            )}
                            {orders.status === 'rejected' && (
                                <p className={styles.orderData}>
                                    <strong>Reason for rejection:</strong> {orders.rejectionReason} 
                                </p>
                            )}
                        </div>
                        <div className={styles.orderDivButton}>
                            <button className={styles.orderButtonBack} onClick={() => navigate(-1)}>Back</button>
                            {orders.status === 'pending' && (
                                <>
                                    <button className={styles.orderButtonAccept} onClick={() => orderAccepted(orders.id)}>Accept</button>
                                    <button className={styles.orderButtonReject} onClick={() => { setShowRejectModal(true); setOrderId(orders.id); }}>Reject</button>
                                </>
                            )}
                            {orders.status === 'under_preparing' && (
                                <button className={styles.orderButtonCompleted} onClick={() => orderCompleted(orders.id)}>Completed</button>
                            )}
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
                </div>
            ) : (
                <div className={styles.orderLoader}>
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
};

export { OrderDetails };
