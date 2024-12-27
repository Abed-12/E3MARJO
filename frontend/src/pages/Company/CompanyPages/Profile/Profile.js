import React from 'react'
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

    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/company-login');
        }, 500)
    }

    const downloadCommercialRegisterPdf = async () => {
        try {
            const url = `http://localhost:8080/auth/company/company-commercial-register`;
            const options = {
                method:'GET',
                headers: { Authorization: localStorage.getItem('token') }
            }
            const response = await fetch(url, options);
            const contentDisposition = response.headers.get('content-disposition');
            const filename = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'file.pdf';
            const file = await response.blob();
            saveAs(file, filename)
        } catch (err) {
            handleError(err);
        }

    }

    return (
        <section className={styles.profileBody}>
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

            <div className={styles.profileContainer}>
                <div className={styles.profileRow}>
                    <h1 className={styles.profileH1}>{decodedData.companyName} Profile</h1>
                    <p><strong>Company name:</strong> {decodedData.companyName}</p>
                    <p><strong>Company ID:</strong> {decodedData.companyID}</p>
                    <p><strong>Email:</strong> {decodedData.email}</p>
                    <p><strong>Phone:</strong> {decodedData.companyPhone}</p>
                    <p>
                        <strong>Commercial register: </strong>
                        <button onClick={downloadCommercialRegisterPdf}>Download PDF</button>
                    </p>
                </div>
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
            <ToastContainer/>
        </section>
    );
}

export {Profile};