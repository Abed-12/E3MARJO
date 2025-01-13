import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import styles from './UnderPreparingOrders.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import Footer from '../../../../components/footer/Footer';
import OrderFilter from '../../../../components/orderFilter/OrderFilter';
import moment from 'moment';

function UnderPreparingOrders() {
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
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            fetchDataOrder();
        } catch (error) {
            handleError('Error dropping order:', error);
        }
    }

    // Function to handle the filtering logic
    const handleFilter = async (filterData) => {
        try {
            const response = await fetch(`http://localhost:8080/auth/company/order-data?statuses=${filterData.selectedStatus}&type=${filterData.type}&supplierID=${filterData.supplierID}&fromDate=${filterData.fromDate}&toDate=${filterData.toDate}`, {
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


    const fetchDataOrder = async () => {
        try {
            const statuses = "under_preparing,completed";
            const url = `http://localhost:8080/auth/company/order-data?statuses=${statuses}`;
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

    useEffect(() => {
        fetchDataOrder();
    }, []);

    return(
        <section className={styles.underPreparingOrdersBody}>
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
            
            <OrderFilter user='company' statuses={['under_preparing', 'completed']} onFilter={handleFilter} />

            <div className={styles.underPreparingOrdersTitle}>
                <h2 className={styles.underPreparingOrdersH2}>Under Preparing Orders</h2>
            </div>
            {filteredOrders ? (
                <div className={styles.underPreparingOrdersContainer}>
                    {filteredOrders && filteredOrders.length > 0 ? (
                        filteredOrders.map((order, index) => (
                            <div className={styles.underPreparingOrdersRow} key={index}>
                                {order.type === 'cement' && (
                                    <>
                                        <div className={styles.underPreparingOrdersDiv}>
                                            <p className={`${styles.underPreparingOrdersData} ${styles.underPreparingOrdersSupplierName}`}>
                                                <strong>Supplier name:</strong> {order.supplierName} 
                                            </p>
                                            <p className={`${styles.underPreparingOrdersData} ${styles.underPreparingOrdersSupplierName}`}>
                                                <strong>Supplier name:</strong> {order.supplierPhone} 
                                            </p>
                                        </div>
                                        <div className={styles.underPreparingOrdersDiv}>
                                            <p className={`${styles.underPreparingOrdersData} ${styles.underPreparingOrdersStatus}`}>
                                                <strong>Order status:</strong> {order.status} 
                                            </p>
                                            <p className={`${styles.underPreparingOrdersData} ${styles.underPreparingOrdersType}`}>
                                                <strong>Order type:</strong> {order.type} 
                                            </p>
                                        </div>
                                        <hr />
                                        <div className={styles.underPreparingOrdersDiv}>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Company name:</strong> {order.companyName} 
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Company phone:</strong> {order.companyPhone} 
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Recipient's name:</strong> {order.recipientName} 
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Recipient's phone:</strong> {order.recipientPhone} 
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Delivery time:</strong> {moment(order.deliveryTime * 1000).format('D/MM/YYYY - h:mm a')} 
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Location:</strong> {order.location} 
                                            </p>
                                        </div>
                                        <div className={styles.underPreparingOrdersDiv}>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Cement quantity:</strong> {order.cementQuantity} ton
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Number of cement bags:</strong> {order.cementNumberBags} 
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Cement price:</strong> {order.price} JD
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Order request time:</strong> {moment(order.orderRequestTime * 1000).format('D/MM/YYYY - h:mm a')} 
                                            </p>
                                        </div>
                                        {order.status === 'completed' && (
                                            <div className={styles.underPreparingOrdersDivButton}>
                                                <button className={styles.underPreparingOrdersButtonDelivered} onClick={() => orderDelivered(order.id)}>Delivered</button>
                                            </div>
                                        )}
                                        </>
                                )}
                                {order.type === 'concrete' && (
                                    <>
                                        <div className={styles.underPreparingOrdersDiv}>
                                            <p className={`${styles.underPreparingOrdersData} ${styles.underPreparingOrdersSupplierName}`}>
                                                <strong>Supplier name:</strong> {order.supplierName} 
                                            </p>
                                            <p className={`${styles.underPreparingOrdersData} ${styles.underPreparingOrdersSupplierName}`}>
                                                <strong>Supplier name:</strong> {order.supplierPhone} 
                                            </p>
                                        </div>
                                        <div className={styles.underPreparingOrdersDiv}>
                                            <p className={`${styles.underPreparingOrdersData} ${styles.underPreparingOrdersStatus}`}>
                                                <strong>Order status:</strong> {order.status}
                                            </p>
                                            <p className={`${styles.underPreparingOrdersData} ${styles.underPreparingOrdersType}`}>
                                                <strong>Order type:</strong> {order.type}
                                            </p>
                                        </div>
                                        <hr />
                                        <div className={styles.underPreparingOrdersDiv}>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Company name:</strong> {order.companyName}
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Company phone:</strong> {order.companyPhone}
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Recipient's name:</strong> {order.recipientName}
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Recipient's phone:</strong> {order.recipientPhone}
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Delivery time:</strong> {moment(order.deliveryTime * 1000).format('D/MM/YYYY - h:mm a')}
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Location:</strong> {order.location}
                                            </p>
                                        </div>
                                        <div className={styles.underPreparingOrdersDiv}>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Concrete quantity:</strong> {order.concreteQuantity} m³
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Concrete strength:</strong>{" "}
                                                {Object.entries(order.concreteStrength).map(([key], index, array) => (
                                                    <span key={key}>
                                                        {key}
                                                        {index < array.length - 1 && " - "}
                                                    </span>
                                                ))}
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Concrete price:</strong> {order.price} JD
                                            </p>
                                            <p className={styles.underPreparingOrdersData}>
                                                <strong>Order request time:</strong> {moment(order.orderRequestTime * 1000).format('D/MM/YYYY - h:mm a')}
                                            </p>
                                            {order.concreteNote && (
                                                <p className={styles.underPreparingOrdersData}>
                                                    <strong>Note:</strong> {order.concreteNote}
                                                </p>
                                            )}
                                        </div>
                                        {order.status === 'completed' && (
                                            <div className={styles.underPreparingOrdersDivButton}>
                                                <button className={styles.underPreparingOrdersButtonDelivered} onClick={() => orderDelivered(order.id)}>Delivered</button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className={styles.underPreparingOrdersP} >No under preparing orders found</p>
                    )}
                </div>
            ) : (
                <div className={styles.underPreparingOrdersLoader}>
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

export { UnderPreparingOrders };