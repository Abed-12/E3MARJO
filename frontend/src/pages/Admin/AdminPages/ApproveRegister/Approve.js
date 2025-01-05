import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Approve.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import { handleSuccess, handleError } from '../../../../utils/utils';
import { saveAs } from 'file-saver';
import ConfirmationModal from "../../../../components/confirmationModal/ConfirmationModal";

function ApproveRegister() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState(null);
    const [suppliers, setSuppliers] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState(null);

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

    const initiateDelete = (id, type) => {
        setDeleteInfo({ id, type });
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            const { id, type } = deleteInfo;
            const endpoint = type === 'supplier'
                ? `http://localhost:8080/auth/supplier/delete/${id}`
                : `http://localhost:8080/auth/company/delete/${id}`;

            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: { Authorization: localStorage.getItem('token') },
            });

            if (response.ok) {
                if (type === 'supplier') {
                    setSuppliers(current =>
                        current.filter(supplier => supplier.supplierID !== id)
                    );
                    handleSuccess('Supplier deleted successfully');
                } else {
                    setCompanies(current =>
                        current.filter(company => company.companyID !== id)
                    );
                    handleSuccess('Company deleted successfully');
                }
            } else {
                console.error(`Failed to delete ${type}:`, response.statusText);
            }
        } catch (error) {
            console.error('Delete operation failed:', error);
        } finally {
            setShowModal(false);
            setDeleteInfo(null);
        }
    };

    const cancelDelete = () => {
        setShowModal(false);
        setDeleteInfo(null);
    };

    const downloadCommercialRegister = async (ID, type) => {
        try {
            const url = type === 'supplier'
                ? `http://localhost:8080/auth/supplier/admin-commercial-register/${ID}`
                : `http://localhost:8080/auth/company/admin-commercial-register/${ID}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: { Authorization: localStorage.getItem('token') }
            });
            
            const contentDisposition = response.headers.get('content-disposition');
            const filename = contentDisposition 
                ? contentDisposition.split('filename=')[1].replace(/"/g, '') 
                : 'file.pdf';
            
            const file = await response.blob();
            saveAs(file, filename);
        } catch (err) {
            handleError(err);
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
                    <h2 className={styles.List}>Suppliers Approved List:</h2>
                    <div className={styles.profileContainer}>
                        {suppliers.length > 0 ? (
                            suppliers.map((field) => (
                                <div className={styles.profileRow} key={field._id}>
                                    <p><strong>Supplier name:</strong> {field.supplierName}</p>
                                    <p><strong>Supplier email:</strong> {field.email}</p>
                                    <p><strong>Supplier ID:</strong> {field.supplierID}</p>
                                    <p><strong>Supplier phone:</strong> {field.supplierPhone}</p>
                                    <p><strong>Supplier product:</strong> {field.supplierProduct}</p>
                                    <div>
                                        {field.supplierProduct === "concrete" ? (
                                            <div>
                                                <strong>Supplier strength/price:</strong>
                                                {Object.entries(field.concreteStrength).map(([strength, price]) => (
                                                    <div key={strength}>
                                                        Strength {strength}: {price} JD
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>
                                                <strong>Supplier item price:</strong> {field.price} JD
                                            </div>
                                        )}
                                    </div>
                                    <p>
                                        <strong>Commercial register:</strong>
                                        <button 
                                            className={styles.approveDownloadButton}
                                            onClick={() => downloadCommercialRegister(field.supplierID, 'supplier')}
                                        >
                                            Download PDF
                                        </button>
                                    </p>
                                    <p><strong>Admin name:</strong> {field.adminName}</p>
                                    <button
                                        className={styles.pendingButtonDrop}
                                        onClick={() => initiateDelete(field.supplierID, 'supplier')}
                                    >
                                        Delete Supplier
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No suppliers found.</p>
                        )}
                    </div>

                    <h2 className={styles.List}>Companies Approved List:</h2>
                    <div className={styles.profileContainer}>
                        {companies.length > 0 ? (
                            companies.map((field) => (
                                <div className={styles.profileRow} key={field._id}>
                                    <p><strong>Company name:</strong> {field.companyName}</p>
                                    <p><strong>Company email:</strong> {field.email}</p>
                                    <p><strong>Company ID:</strong> {field.companyID}</p>
                                    <p><strong>Company phone:</strong> {field.companyPhone}</p>
                                    <p>
                                        <strong>Commercial register:</strong>
                                        <button 
                                            className={styles.approveDownloadButton}
                                            onClick={() => downloadCommercialRegister(field.companyID, 'company')}
                                        >
                                            Download PDF
                                        </button>
                                    </p>
                                    <p><strong>Admin name:</strong> {field.adminName}</p>
                                    <button
                                        className={styles.pendingButtonDrop}
                                        onClick={() => initiateDelete(field.companyID, 'company')}
                                    >
                                        Delete Company
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No companies found.</p>
                        )}
                    </div>
                </>
            ) : (
                <div className={styles.profileLoader}>
                    <div className={styles.loader}></div>
                </div>
            )}

            {showModal && (
                <ConfirmationModal
                    message={`Are you sure you want to delete this ${deleteInfo?.type}?`}
                    onConfirm={handleDelete}
                    onCancel={cancelDelete}
                />
            )}
            <ToastContainer />
        </div>
    );
}

export default ApproveRegister;