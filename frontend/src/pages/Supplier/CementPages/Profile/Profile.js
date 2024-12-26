import React, { useEffect, useState } from 'react'
import {jwtDecode} from "jwt-decode";
import { handleError, handleSuccess } from '../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import Footer from '../../../../components/footer/Footer';

function Profile() {
    const token = localStorage.getItem("token");
    const decodedData = jwtDecode(token);

    const [supplierData, setSupplierData] = useState('');

    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/supplier-login');
        }, 500)
    }    

    const handleEditPriceClick = () => {
        navigate("/supplier/cement/profile/edit-profile"); 
    };

    const fetchSupplierData = async () => {
        try {
            const url = `http://localhost:8080/auth/supplier/supplier-data`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                }
            }
            const response = await fetch(url, headers);
            const result = await response.json();
            console.log(result);
            setSupplierData(result);
        } catch (err) {
            handleError(err);
        }
    }

    useEffect(() => {
        fetchSupplierData();
    }, []);

    return(
        <section className={styles.profileBody}>
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

            <div className={styles.profileContainer}>
                <div className={styles.profileRow}>
                    <h1 className={styles.profileH1}>{decodedData.supplierName} Profile</h1>
                    <button className={styles.profileEditPriceButton} onClick={handleEditPriceClick}>Edit Profile</button>
                    <p><strong>Supplier name:</strong> {decodedData.supplierName}</p>
                    <p><strong>Supplier ID:</strong> {decodedData.supplierID}</p>
                    <p><strong>Email:</strong> {decodedData.email}</p>
                    <p><strong>Phone:</strong> {supplierData.supplierPhone}</p>
                    <p><strong>Product:</strong> {decodedData.supplierProduct}</p>
                    <p>
                        <strong>Commercial register: </strong> 
                        <a href={`http://localhost:5000/uploads/${supplierData.commercialRegister}`} target="_blank" rel="noopener noreferrer">View PDF</a>
                    </p>
                    <p><strong>Price of one bag:</strong> {supplierData.price} JD</p>
                </div>
            </div>

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

export { Profile };