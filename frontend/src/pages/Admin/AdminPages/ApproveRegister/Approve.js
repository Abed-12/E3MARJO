import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Approve.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import { handleSuccess } from '../../../../utils/utils';
import UserTable from '../../../../components/userTable/UserTable';
import { BsArrowRightCircleFill } from "react-icons/bs";


function ApproveRegister() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState(null);
    const [suppliers, setSuppliers] = useState(null);
    const [view, setView] = useState('suppliers');

    useEffect(() => {
        const getData = async () => {
            try {
                const supplierData = await fetchSuppliersdata();
                const companyData = await fetchCompaniesData();
                setSuppliers(supplierData || []);
                setCompanies(companyData || []);
            } catch (error) {
                console.error("Failed to fetch companies and suppliers:", error);
            }
        };

        getData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/admin');
        }, 500);
    };

    const fetchCompaniesData = async () => {
        try {
            const companyResponse = await fetch('http://localhost:8080/auth/company/companyData', {
                method: 'GET',
                headers: { Authorization: localStorage.getItem('token') },
            });
            if (!companyResponse.ok) throw new Error('Failed to fetch company');
            return await companyResponse.json();
        } catch (error) {
            console.error('Failed to fetch company data:', error);
            return [];
        }
    };

    const fetchSuppliersdata = async () => {
        try {
            const supplierResponse = await fetch('http://localhost:8080/auth/supplier/supplierData', {
                method: 'GET',
                headers: { Authorization: localStorage.getItem('token') },
            });
            if (!supplierResponse.ok) throw new Error('Failed to fetch suppliers');
            return await supplierResponse.json();
        } catch (error) {
            console.error(error.message);
            return [];
        }
    };

    return (
        <div className={styles.body}>
            <Navbar
                three="Approved"
                pathThree="/admin/approve-user"
                four="Rejected"
                pathFour="/admin/reject-user"
                five="Pending"
                pathFive="/admin/request-user"
                six="Add Admin"
                pathSix="/admin/add-admin"
                logout={handleLogout}
            />

            {suppliers && companies ? (
                <>
                    <div className={styles.profileContainer}>
                        {/* Toggle button for switching between Categories and Types */}
                        <button 
                            className={styles.toggleButton}
                            title={view === 'suppliers' ? 'View Companies' : 'View Suppliers'}
                            onClick={() => setView(view === 'suppliers' ? 'companies' : 'suppliers')}
                        >
                            {/* header */}
                            <h2 className={styles.List}>
                                {view === 'suppliers' ? 'Suppliers Approved List' : 'Companies Approved List'}
                                <BsArrowRightCircleFill className={styles.arrowIcon}/>
                            </h2>
                        </button>
                    </div>
                    
                    {view === 'suppliers' ? (
                        <div className={styles.profileContainer}>
                            {suppliers.length > 0 ? (
                                <UserTable data={suppliers} registrationState='active' role='supplier'/>
                            ) : (
                                <p>No suppliers found.</p>
                            )}
                        </div>
                    ) : (
                        <div className={styles.profileContainer}>
                            {companies.length > 0 ? (
                                <UserTable data={companies} registrationState='active' role='company'/>
                            ) : (
                                <p>No companies found.</p>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.profileLoader}>
                    <div className={styles.loader}></div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}

export default ApproveRegister;