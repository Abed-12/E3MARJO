import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import styles from './OldOrders.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import Footer from '../../../../components/footer/Footer';
import OrderFilter from '../../../../components/orderFilter/OrderFilter';
import moment from 'moment';

function OldOrders() {
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

    useEffect(() => {
        const fetchDataOrder = async () => {
            try {
                const statuses = "delivered,rejected";
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
        fetchDataOrder();
    }, []);

    return(
        <section className={styles.oldOrdersBody}>
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

            <OrderFilter user='company' statuses={['delivered', 'rejected']} onFilter={handleFilter} />
            
            <div className={styles.oldOrdersTitle}>
                <h2 className={styles.oldOrdersH2}>Old Orders</h2>
            </div>
            {filteredOrders ? (
                <div className={styles.oldOrdersContainer}>
                    {filteredOrders && filteredOrders.length > 0 ? (
                        filteredOrders.map((order, index) => (
                            <div className={styles.oldOrdersRow} key={index}> 
                                {order.type === 'cement' && (
                                    <>
                                        <div className={styles.oldOrdersDiv}>
                                            <p className={`${styles.oldOrdersData} ${styles.oldOrdersSupplierName}`}>
                                                <strong>Supplier name:</strong> {order.supplierName}
                                            </p>
                                            <p className={`${styles.oldOrdersData} ${styles.oldOrdersSupplierName}`}>
                                                <strong>Supplier phone:</strong> {order.supplierPhone}
                                            </p>
                                        </div>
                                        <div className={styles.oldOrdersDiv}>
                                            <p className={`${styles.oldOrdersData} ${styles.oldOrdersStatus}`}>
                                                <strong>Order status:</strong> {order.status} 
                                            </p>
                                            <p className={`${styles.oldOrdersData} ${styles.oldOrdersType}`}>
                                                <strong>Order type:</strong> {order.type} 
                                            </p>
                                        </div>
                                        <hr />
                                        <div className={styles.oldOrdersDiv}>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Company name:</strong> {order.companyName} 
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Company phone:</strong> {order.companyPhone} 
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Recipient's name:</strong> {order.recipientName} 
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Recipient's phone:</strong> {order.recipientPhone} 
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Delivery time:</strong> {moment(order.deliveryTime * 1000).format('D/MM/YYYY - h:mm a')}  
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Location:</strong> {order.location} 
                                            </p>
                                        </div>
                                        <div className={styles.oldOrdersDiv}>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Cement quantity:</strong> {order.cementQuantity} ton
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Number of cement bags:</strong> {order.cementNumberBags} 
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Cement price:</strong> {order.price} JD
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Order request time:</strong> {moment(order.orderRequestTime * 1000).format('D/MM/YYYY - h:mm a')} 
                                            </p>
                                        </div>
                                        {order.status === 'rejected' && (
                                            <p className={styles.oldOrdersData}>
                                                <strong>Reason for rejection:</strong> {order.rejectionReason} 
                                            </p>
                                        )}
                                    </>
                                )}
                                {order.type === 'concrete' && (
                                    <>
                                        <div className={styles.oldOrdersDiv}>
                                            <p className={`${styles.oldOrdersData} ${styles.oldOrdersSupplierName}`}>
                                                <strong>Supplier name:</strong> {order.supplierName}
                                            </p>
                                            <p className={`${styles.oldOrdersData} ${styles.oldOrdersSupplierName}`}>
                                                <strong>Supplier phone:</strong> {order.supplierPhone}
                                            </p>
                                        </div>
                                        <div className={styles.oldOrdersDiv}>
                                            <p className={`${styles.oldOrdersData} ${styles.oldOrdersStatus}`}>
                                                <strong>Order status:</strong> {order.status}
                                            </p>
                                            <p className={`${styles.oldOrdersData} ${styles.oldOrdersType}`}>
                                                <strong>Order type:</strong> {order.type}
                                            </p>
                                        </div>
                                        <hr />
                                        <div className={styles.oldOrdersDiv}>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Company name:</strong> {order.companyName}
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Company phone:</strong> {order.companyPhone}
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Recipient's name:</strong> {order.recipientName}
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Recipient's phone:</strong> {order.recipientPhone}
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Delivery time:</strong> {moment(order.deliveryTime * 1000).format('D/MM/YYYY - h:mm a')}
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Location:</strong> {order.location}
                                            </p>
                                        </div>
                                        <div className={styles.oldOrdersDiv}>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Concrete quantity:</strong> {order.concreteQuantity} m³
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Concrete strength:</strong>{" "}
                                                {Object.entries(order.concreteStrength).map(([key], index, array) => (
                                                    <span key={key}>
                                                        {key}
                                                        {index < array.length - 1 && " - "}
                                                    </span>
                                                ))}
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Concrete price:</strong> {order.price} JD
                                            </p>
                                            <p className={styles.oldOrdersData}>
                                                <strong>Order request time:</strong> {moment(order.orderRequestTime * 1000).format('D/MM/YYYY - h:mm a')}
                                            </p>
                                            {order.concreteNote && (
                                                <p className={styles.oldOrdersData}>
                                                    <strong>Note:</strong> {order.concreteNote}
                                                </p>
                                            )}
                                            {order.status === 'rejected' && (
                                                <p className={styles.oldOrdersData}>
                                                    <strong>Reason for rejection:</strong> {order.rejectionReason} 
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
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

export { OldOrders };
