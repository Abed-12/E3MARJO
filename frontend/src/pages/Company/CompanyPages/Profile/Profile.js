import React, {useEffect, useState} from 'react'
import {jwtDecode} from "jwt-decode";
import {handleError, handleSuccess} from '../../../../utils/utils';
import {ToastContainer} from 'react-toastify';
import {Link, useNavigate} from 'react-router-dom';
import styles from './Profile.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import Footer from '../../../../components/footer/Footer';
import {saveAs} from 'file-saver';

function Profile() {
    const token = localStorage.getItem("token");
    const decodedData = jwtDecode(token);

    const [dropdownActive, setDropdownActive] = useState(false);
    const [companyData, setCompanyData] = useState(null);

    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/company-login');
        }, 500)
    }

    const toggleDropdown = () => {
        setDropdownActive(prev => !prev);
    };

    const downloadCommercialRegisterPdf = async () => {
        try {
            const url = `http://localhost:8080/auth/company/company-commercial-register`;
            const options = {
                method:'GET',
                headers: { Authorization: localStorage.getItem('token') }
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
    
    const fetchCompanyData = async () => {
        try {
            const url = `http://localhost:8080/auth/company/company-data`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                }
            }
            const response = await fetch(url, headers);
            const result = await response.json();
            setCompanyData(result);
        } catch (err) {
            handleError(err);
        }
    }
    
    useEffect(() => {
        fetchCompanyData();
    }, []);


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
                pathThree="/company/home/cement-orders"
                four="Concrete"
                pathFour="/company/home/concrete-orders"
                five="Profile"
                pathFive="/company/home/profile"
                logout={handleLogout}
            />

            {companyData ? (
                <div className={styles.profileContainer}>
                    <div className={styles.profileRow}>
                        <h1 className={styles.profileH1}>{decodedData.companyName} Profile</h1>
                        <button
                            className={`${styles.profileSettingsButton} ${styles.dropdownToggle}`}
                            aria-expanded={dropdownActive}
                            onClick={toggleDropdown}>
                            Settings
                        </button>
                        <ul className={`${styles.dropdownMenu} ${dropdownActive ? styles.show : ''}`}>
                            <li className={styles.dropdownItem}>
                                <Link className={styles.Link} to='/company/home/profile/edit-profile'>Edit profile</Link>
                            </li>
                            <li className={styles.dropdownItem}>
                                <Link className={styles.Link} to='#'>#</Link>
                            </li>
                        </ul>
                        <p><strong>Company name:</strong> {decodedData.companyName}</p>
                        <p><strong>Company ID:</strong> {decodedData.companyID}</p>
                        <p><strong>Email:</strong> {decodedData.email}</p>
                        <p><strong>Phone:</strong> {companyData.companyPhone}</p>
                        <p><strong>Multi-Factor Auth: </strong>
                            {companyData.otpEnabled ? <span style={{color: "green"}}>Enabled</span> :
                                <span style={{color: "red"}}>Disabled</span>}
                        </p>
                        <p>
                            <strong>Commercial register: </strong>
                            <button className={styles.profileDownloadButton}
                                    onClick={downloadCommercialRegisterPdf}>Download PDF
                            </button>
                        </p>
                    </div>
                </div>
            ) : (
                <div className={styles.profileContainer}>
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
            <ToastContainer/>
        </section>
    );
}

export {Profile};