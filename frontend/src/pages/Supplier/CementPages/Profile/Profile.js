import React, {useEffect, useState} from 'react'
import {jwtDecode} from "jwt-decode";
import {handleError, handleSuccess} from '../../../../utils/utils';
import {ToastContainer} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import styles from './Profile.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import Footer from '../../../../components/footer/Footer';
import {saveAs} from 'file-saver';

function Profile() {
    const token = localStorage.getItem("token");
    const decodedData = jwtDecode(token);

    const [supplierData, setSupplierData] = useState(null);

    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/supplier-login');
        }, 500)
    }

    const handleEditProfileClick = () => {
        navigate("/supplier/cement/profile/edit-profile");
    };

    const downloadCommercialRegisterPdf = async () => {
        try {
            const url = `http://localhost:8080/auth/supplier/supplier-commercial-register`;
            const options = {
                method: 'GET',
                headers: {Authorization: localStorage.getItem('token')}
            }
            const response = await fetch(url, options);
            const contentDisposition = response.headers.get('content-disposition');
            const filename = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : `file.pdf`;
            const file = await response.blob();
            saveAs(file, filename)
        } catch (err) {
            handleError(err);
        }
        
    }

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
            setSupplierData(result);
        } catch (err) {
            handleError(err);
        }
    }

    useEffect(() => {
        fetchSupplierData();
    }, []);
    
    return (
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

            {supplierData ? (
                <div className={styles.profileContainer}>
                    <div className={styles.profileRow}>
                        <h1 className={styles.profileH1}>{decodedData.supplierName} Profile</h1>
                        <button className={styles.profileEditProfileButton} onClick={handleEditProfileClick}>Edit Profile</button>
                        <p><strong>Supplier name:</strong> {decodedData.supplierName}</p>
                        <p><strong>Supplier ID:</strong> {decodedData.supplierID}</p>
                        <p><strong>Email:</strong> {decodedData.email}</p>
                        <p><strong>Phone:</strong> {supplierData.supplierPhone}</p>
                        <p><strong>Product:</strong> {decodedData.supplierProduct}</p>
                        <p>
                            <strong>Commercial register: </strong>
                            <button className={styles.profileDownloadButton} onClick={downloadCommercialRegisterPdf}>Download PDF</button>
                        </p>
                        <p><strong>Price of one bag:</strong> {supplierData.price} JD</p>
                    </div>
                </div>
            ) : (
                <div className={styles.profileContainer}>
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
            <ToastContainer/>
        </section>
    );
}

export {Profile};