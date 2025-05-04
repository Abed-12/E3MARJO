import React, { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../../../../utils/utils";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../../components/navbar/Navbar";
import Footer from "../../../../components/footer/Footer";
import ConfirmationModal from '../../../../components/confirmationModal/ConfirmationModal';
import styles from "./OrderDetails.module.css";

const OrderDetails = () => {
    const [orders, setOrders] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [deleteOrder, setDeleteOrder] = useState(null); // Store the concrete strength to be deleted

    const location = useLocation();
    const navigate = useNavigate();

    const { id } = location.state;

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/company-login');
        }, 500)
    }

    // Delete message
    const handleDelete = (orderId) => {
        setDeleteOrder(orderId);
        setShowModal(true); // Show the confirmation modal
    };

    const cancelDelete = () => {
        setShowModal(false); // Close the modal without deletion
    };

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
                setShowModal(false);
                setTimeout(() => {
                    navigate('/company/home/pending-orders');
                }, 500);
            } else if (!success) {
                handleError(message);
            }
        } catch (error) {
            handleError('Error dropping order:', error);
        }
    }

    // Change order to delivered
    const orderDelivered = async (id) => {
        try{
            const data = {
                "id": id,
                "status": "delivered"
            }
            const url = 'http://localhost:8080/auth/company/update-order-status';
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
                handleSuccess(message + "Order has been delivered");
                setTimeout(() => {
                    navigate('/company/home/under-preparing-orders');
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
                const url = `http://localhost:8080/auth/company/order-data/${id}`;
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
                        {orders.type === "cement" && (
                            <>
                                <div className={styles.orderDiv}>
                                    <p className={`${styles.orderData} ${styles.orderSupplierName}`} >
                                        <strong>Supplier name:</strong> {orders.supplierName}
                                    </p>
                                    <p className={`${styles.orderData} ${styles.orderSupplierName}`} >
                                        <strong>Supplier phone:</strong> {orders.supplierPhone}
                                    </p>
                                </div>
                                <div className={styles.orderDiv}>
                                    <p className={`${styles.orderData} ${styles.orderStatus}`} >
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
                                        <strong>Delivery time:</strong>{" "}
                                        {moment(orders.deliveryTime * 1000).format(
                                            "D/MM/YYYY - h:mm a"
                                        )}
                                    </p>
                                    <p className={styles.orderData}>
                                        <strong>Location:</strong> {orders.location}
                                    </p>
                                </div>
                                <div className={styles.orderDiv}>
                                    <p className={styles.orderData}>
                                        <strong>Cement quantity:</strong> {orders.cementQuantity}{" "}
                                        ton
                                    </p>
                                    <p className={styles.orderData}>
                                        <strong>Number of cement bags:</strong>{" "}
                                        {orders.cementNumberBags}
                                    </p>
                                    <p className={styles.orderData}>
                                        <strong>Cement price:</strong> {orders.price} JD
                                    </p>
                                    <p className={styles.orderData}>
                                        <strong>Order request time:</strong>{" "}
                                        {moment(orders.orderRequestTime * 1000).format(
                                            "D/MM/YYYY - h:mm a"
                                        )}
                                    </p>
                                    {orders.status === "rejected" && (
                                    <p className={styles.orderData}>
                                        <strong>Reason for rejection:</strong>{" "}
                                        {orders.rejectionReason}
                                    </p>
                                    )}
                                </div>
                                <div className={styles.orderDivButton}>
                                    <button 
                                        className={styles.orderButtonBack} 
                                        onClick={() => navigate(-1)}
                                    >
                                        Back
                                    </button>
                                    {orders.status === "pending" && (
                                        <button
                                            className={styles.orderButtonDeleted}
                                            onClick={() => handleDelete(orders.id)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    {orders.status === 'completed' && (
                                        <button 
                                            className={styles.orderButtonDelivered} 
                                            onClick={() => orderDelivered(orders.id)}
                                        >
                                            Delivered
                                        </button>
                                    )}
                                </div>  
                            </>
                        )}
                        {orders.type === "concrete" && (
                            <>
                                <div className={styles.orderDiv}>
                                    <p className={`${styles.orderData} ${styles.orderSupplierName}`}>
                                        <strong>Supplier name:</strong> {orders.supplierName}
                                    </p>
                                    <p className={`${styles.orderData} ${styles.orderSupplierName}`}>
                                        <strong>Supplier phone:</strong> {orders.supplierPhone}
                                    </p>
                                </div>
                                <div className={styles.orderDiv}>
                                    <p className={`${styles.orderData} ${styles.orderStatus}`} >
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
                                        <strong>Delivery time:</strong>{" "}
                                        {moment(orders.deliveryTime * 1000).format(
                                            "D/MM/YYYY - h:mm a"
                                        )}
                                    </p>
                                    <p className={styles.orderData}>
                                        <strong>Location:</strong> {orders.location}
                                    </p>
                                </div>
                                <div className={styles.orderDiv}>
                                    <p className={styles.orderData}>
                                        <strong>Concrete quantity:</strong>{" "}
                                        {orders.concreteQuantity} m³
                                    </p>
                                    <p className={styles.orderData}>
                                        <strong>Concrete strength:</strong>{" "}
                                        {Object.entries(orders.concreteStrength).map(
                                            ([key], index, array) => (
                                                <span key={key}>
                                                    {key}
                                                    {index < array.length - 1 && " - "}
                                                </span>
                                            )
                                        )}
                                    </p>
                                    <p className={styles.orderData}>
                                        <strong>Concrete price:</strong> {orders.price} JD
                                    </p>
                                    <p className={styles.orderData}>
                                        <strong>Order request time:</strong>{" "}
                                        {moment(orders.orderRequestTime * 1000).format(
                                            "D/MM/YYYY - h:mm a"
                                        )}
                                    </p>
                                    {orders.concreteNote && (
                                        <p className={styles.orderData}>
                                            <strong>Note:</strong> {orders.concreteNote}
                                        </p>
                                    )}
                                    {orders.status === "rejected" && (
                                        <p className={styles.orderData}>
                                            <strong>Reason for rejection:</strong>{" "}
                                            {orders.rejectionReason}
                                        </p>
                                    )}
                                </div>
                                <div className={styles.orderDivButton}>
                                    <button 
                                        className={styles.orderButtonBack} 
                                        onClick={() => navigate(-1)}
                                    >
                                        Back
                                    </button>
                                    {orders.status === "pending" && (
                                        <button
                                            className={styles.orderButtonDeleted}
                                            onClick={() => handleDelete(orders.id)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    {orders.status === 'completed' && (
                                        <button 
                                            className={styles.orderButtonDelivered} 
                                            onClick={() => orderDelivered(orders.id)}
                                        >
                                            Delivered
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.orderLoader}>
                    <div className={styles.loader}></div>
                </div>
            )}

            {showModal && (
                <ConfirmationModal
                    message={`Are you sure you want to cancel order?`}
                    onConfirm={() => orderDelete(deleteOrder)}
                    onCancel={cancelDelete}
                />
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
};

export { OrderDetails };
