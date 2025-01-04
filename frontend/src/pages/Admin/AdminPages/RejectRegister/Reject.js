import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Reject.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import { handleSuccess, handleError } from '../../../../utils/utils';
import { saveAs } from 'file-saver';
import ConfirmationModal from "../../../../components/confirmationModal/confirmationModal";

function RejectRegister() {
    const navigate = useNavigate();
    const [rejected, setRejected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const rejectedData = await fetchdata();
                setRejected(rejectedData || []);
            } catch (error) {
                console.error("Failed to fetch rejected data:", error);
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

    const fetchdata = async () => {
        try {
            const response = await fetch(
                'http://localhost:8080/auth/register/fetchRegistrationData?status=rejected',
                {
                    method: 'GET',
                    headers: { Authorization: localStorage.getItem('token') }
                }
            );
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err.message);
            return [];
        }
    };

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
                setRejected(currentUsers => 
                    currentUsers.filter(user => user.ID !== userToDelete)
                );
                handleSuccess('User successfully dropped');
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

    const downloadCommercialRegisterPdf = async (ID) => {
        try {
            const url = `http://localhost:8080/auth/register/registration-commercial-register/${ID}`;
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

            {rejected ? (
                <>
                    <h2 className={styles.List}>Rejected Registration:</h2>
                    <div className={styles.profileContainer}>   
                        {(() => {
                            const rejectedUsers = Array.isArray(rejected) ? rejected : [];
                            if (rejectedUsers.length > 0) {
                                return rejectedUsers.map((field) => (
                                    <div className={styles.profileRow} key={field._id}>
                                        <p>
                                            <strong>{field.role === "company" ? "Company" : "Supplier"} name:</strong> {field.name}
                                        </p>
                                        <p>
                                            <strong>{field.role === "company" ? "Company" : "Supplier"} email:</strong> {field.email}
                                        </p>
                                        <p>
                                            <strong>{field.role === "company" ? "Company" : "Supplier"} ID:</strong> {field.ID}
                                        </p>
                                        <p>
                                            <strong>{field.role === "company" ? "Company" : "Supplier"} phone:</strong> {field.phone}
                                        </p>
                                        {field.role === "supplier" && (
                                            <p>
                                                <strong>Supplier product:</strong> {field.supplierProduct}
                                            </p>
                                        )}
                                        <p>
                                            <strong>Commercial register:</strong> 
                                            <button 
                                                className={styles.rejectDownloadButton} 
                                                onClick={() => downloadCommercialRegisterPdf(field.ID)}
                                            >
                                                Download PDF
                                            </button> 
                                        </p>                                 
                                        <p>
                                            <strong>Admin name:</strong> {field.adminName}
                                        </p>
                                        <button
                                            className={styles.pendingButtonDrop}
                                            onClick={() => initiateDelete(field.ID)}
                                        >
                                            Drop
                                        </button>
                                    </div>
                                ));
                            } else {
                                return <p>No Pending registrations found.</p>;
                            }
                        })()}
                    </div>
                </>
            ) : (
                <div className={styles.rejectLoader}>
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
}

export default RejectRegister;