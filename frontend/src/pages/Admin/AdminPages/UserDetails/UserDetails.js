import React, { useEffect, useState } from 'react';
import styles from './UserDetails.module.css';
import Navbar from "../../../../components/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import { handleSuccess , handleError} from '../../../../utils/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import {saveAs} from 'file-saver';
import ConfirmationModal from '../../../../components/confirmationModal/ConfirmationModal';

const UserDetails = () => {
    // not active user
    const [data, setData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // active user
    const [company, setCompany] = useState(null);
    const [supplier, setSupplier] = useState(null);
    const [deleteInfo, setDeleteInfo] = useState(null);
    
    const location = useLocation();
    const navigate = useNavigate();
    const { id, registrationState, role } = location.state;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/admin');
        }, 500);
    };

    useEffect(() => {
        if (registrationState === 'notActive') {
            const getData = async () => {
                try {
                    setData(await fetchData());
                } catch (error) {
                    console.error("Failed to fetch data:", error);
                }
            };
            getData();
        } else if (registrationState === 'active') {
            const getData = async () => {
                try {
                    setCompany(await fetchCompaniesData());
                    setSupplier(await fetchSuppliersdata());
                    console.log(company);
                } catch (error) {
                    console.error("Failed to fetch data:", error);
                }
            };
            getData();
        }
    }, []); 

    if(registrationState === 'notActive') {
                // button to reject the user (in status 'new')
        async function rejectUser(ID) {
            try{
                const response = await fetch(`http://localhost:8080/auth/register/rejected/${ID}`,
                {
                    method:'PATCH',
                    headers: { Authorization: localStorage.getItem('token') }
                });
                if (response.ok) {
                    setData(currentData => {
                        if (Array.isArray(currentData)) {
                            return currentData.filter(user => user.ID !== ID);
                        }
                        return currentData; // Keep it as is (null or other non-array value)
                    });                    handleSuccess('User successfully rejected'); // Show success message
                    setTimeout(() => {
                        navigate(-1);
                    }, 500);
                }
                else {console.error('Failed to delete user :', response.statusText); }
            }
            catch(err)
            {
                console.log("reject user faild " `${err}`)
            }
        };

        // button to approve the user (in status 'new')
        async function approveUser(ID) {
            try {
                const response = await fetch(`http://localhost:8080/auth/register/approve/${ID}`,
                    {
                        method:'PATCH',
                        headers: { Authorization: localStorage.getItem('token') }
                    });
                if (response.ok) {
                    setData(currentData => {
                        if (Array.isArray(currentData)) {
                            return currentData.filter(user => user.ID !== ID);
                        }
                        return null; // Keep it null if it's not an array
                    });                   
                    handleSuccess('User successfully approved'); // Show success message
                    setTimeout(() => {
                        navigate(-1);
                    }, 500);
                }
                else {console.error('Failed to approve user :', response.statusText); }
            }
            catch(err) {
                console.log("approve user faild " `${err}`)
            }
        };

        // button to delete the user (in status 'rejected') 
        const initiateDelete = (id) => {
            setUserToDelete(id);
            setShowModal(true);
        };

        const handleDelete = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/auth/register/delete/${userToDelete}`,
                    {
                        method: 'DELETE',
                        headers: { Authorization: localStorage.getItem('token') },
                    }
                );
    
                if (response.ok) {
                    setData(currentUsers => {
                        if (Array.isArray(currentUsers)) {
                            return currentUsers.filter(user => user.ID !== userToDelete);
                        }
                        return currentUsers; // Keep it as is (null or other non-array value)
                    });
                    handleSuccess('User successfully dropped');
                    setTimeout(() => {
                        navigate(-1);
                    }, 500);
                } else {
                    console.error('Failed to delete user:', response.statusText);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setShowModal(false);
                setUserToDelete(null);
            }
        };

        const cancelDelete = () => {
            setShowModal(false);
            setUserToDelete(null);
        };
        
        async function downloadCommercialRegisterPdf(ID) {
            try {
                const url = `http://localhost:8080/auth/register/registration-commercial-register/${ID}`;
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

        var fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/auth/register/fetchRegistrationData/${id}`,
                    {
                        method:'GET',
                        headers: { Authorization: localStorage.getItem('token') }
                    });
                    const data = await response.json();
                    return data;
                }
            catch(err) {
                console.log(err.message);
            }
        };

        return (
            <div className={styles.body}>
                <ToastContainer />
                
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

                {data ? (
                    <>
                        <h2 className={styles.List}>{data.name} Details</h2>
                        <div className={styles.profileContainer}>
                            <div className={styles.profileRow}>
                                <p><strong>{data.role === "company" ? "Company" : "Supplier"} name:</strong> {data.name}</p>
                                <p><strong>{data.role === "company" ? "Company" : "Supplier"} email:</strong> {data.email}</p>
                                <p><strong>{data.role === "company" ? "Company" : "Supplier"} ID:</strong> {data.ID}</p>
                                <p><strong>{data.role === "company" ? "Company" : "Supplier"} phone:</strong> {data.phone}</p>
                                {data.role === "supplier" && (
                                    <p><strong>Supplier product:</strong> {data.supplierProduct}</p>
                                )}
                                <p><strong>Commercial register:</strong> 
                                    <button className={styles.requestDownloadButton} onClick={() => downloadCommercialRegisterPdf(data.ID)}>
                                        Download PDF
                                    </button>
                                </p>
                                {data.status === 'new' && (
                                    <div className={styles.divButton}>
                                        <button 
                                            className={styles.buttonBack} 
                                            onClick={() => navigate(-1)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            className={styles.pendingButtonAccept}
                                            onClick={() => approveUser(data.ID)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className={styles.pendingButtonReject}
                                            onClick={() => rejectUser(data.ID)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                                {data.status === 'rejected' && (
                                    <>
                                        <p>
                                            <strong>Admin name:</strong> {data.adminName}
                                        </p>
                                        <div className={styles.divButton}>
                                            <button 
                                                className={styles.buttonBack} 
                                                onClick={() => navigate(-1)}
                                            >
                                                Back
                                            </button>
                                            <button
                                                className={styles.pendingButtonDrop}
                                                onClick={() => initiateDelete(data.ID)}
                                            >
                                                Drop
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.requestLoader}>
                        <div className={styles.loader}></div>
                    </div>
                )}

                {showModal && (
                    <ConfirmationModal
                        message="Are you sure you want to drop this user?"
                        onConfirm={handleDelete}
                        onCancel={cancelDelete}
                    />
                )}
            </div>
        );
    } else if(registrationState === 'active') {
        var fetchCompaniesData = async () => {
            try {
                const companyResponse = await fetch(`http://localhost:8080/auth/company/companyData/${id}`, {
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

        var fetchSuppliersdata = async () => {
            try {
                const supplierResponse = await fetch(`http://localhost:8080/auth/supplier/supplierData/${id}`, {
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
                        setSupplier(current => {
                            if (Array.isArray(current)) {
                                return current.filter(supplier => supplier.supplierID !== id);
                            }
                            return current; // Keep it as is (null or other non-array value)
                        });
                        handleSuccess('Supplier deleted successfully');
                        setTimeout(() => {
                            navigate(-1);
                        }, 500);
                    } else {
                        setCompany(current => {
                            if (Array.isArray(current)) {
                                return current.filter(company => company.companyID !== id);
                            }
                            return current; // Keep it as is (null or other non-array value)
                        });
                        handleSuccess('Company deleted successfully');
                        setTimeout(() => {
                            navigate(-1);
                        }, 500);
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

                {supplier && company ? (
                    <>
                        {role === 'supplier' && (
                            <>
                                <h2 className={styles.List}>{supplier.supplierName} Details</h2>
                                <div className={styles.profileContainer}>
                                    <div className={styles.profileRow}>
                                        <p><strong>Supplier name:</strong> {supplier.supplierName}</p>
                                        <p><strong>Supplier email:</strong> {supplier.email}</p>
                                        <p><strong>Supplier ID:</strong> {supplier.supplierID}</p>
                                        <p><strong>Supplier phone:</strong> {supplier.supplierPhone}</p>
                                        <p><strong>Supplier product:</strong> {supplier.supplierProduct}</p>
                                        <div>
                                            {supplier.supplierProduct === "concrete" ? (
                                                <div>
                                                    <strong>Supplier strength/price:</strong>
                                                    {Object.entries(supplier.concreteStrength).map(([strength, price]) => (
                                                        <div key={strength}>
                                                            Strength {strength}: {price} JD
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div>
                                                    <strong>Supplier item price:</strong> {supplier.price} JD
                                                </div>
                                            )}
                                        </div>
                                        <p>
                                            <strong>Commercial register:</strong>
                                            <button 
                                                className={styles.requestDownloadButton}
                                                onClick={() => downloadCommercialRegister(supplier.supplierID, 'supplier')}
                                            >
                                                Download PDF
                                            </button>
                                        </p>
                                        <p><strong>Admin name:</strong> {supplier.adminName}</p>
                                        <div className={styles.divButton}>
                                            <button   
                                                className={styles.buttonBack} 
                                                onClick={() => navigate(-1)}
                                            >
                                                Back
                                            </button>
                                            <button 
                                                className={`${styles.pendingButtonDrop} ${styles.pendingButtonReject}`}                                               
                                                onClick={() => initiateDelete(supplier.supplierID, 'supplier')}
                                            >
                                                Delete Supplier
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {role === 'company' && (
                            <>
                                <h2 className={styles.List}>{company.companyName} Details</h2>
                                <div className={styles.profileContainer}>
                                    <div className={styles.profileRow}>
                                        <p><strong>Company name:</strong> {company.companyName}</p>
                                        <p><strong>Company email:</strong> {company.email}</p>
                                        <p><strong>Company ID:</strong> {company.companyID}</p>
                                        <p><strong>Company phone:</strong> {company.companyPhone}</p>
                                        <p>
                                            <strong>Commercial register:</strong>
                                            <button 
                                                className={styles.requestDownloadButton}
                                                onClick={() => downloadCommercialRegister(company.companyID, 'company')}
                                            >
                                                Download PDF
                                            </button>
                                        </p>
                                        <p><strong>Admin name:</strong> {company.adminName}</p>
                                        <div className={styles.divButton}>
                                        <button 
                                                className={styles.buttonBack} 
                                                onClick={() => navigate(-1)}
                                            >
                                                Back
                                            </button>
                                            <button
                                                className={`${styles.pendingButtonDrop} ${styles.pendingButtonReject}`}                                               
                                                onClick={() => initiateDelete(company.companyID, 'company')}
                                            >
                                                Delete Company
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className={styles.requestLoader}>
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
}

export {UserDetails};
