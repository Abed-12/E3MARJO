import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Reject.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import { handleSuccess } from '../../../../utils/utils';
import UserTable from '../../../../components/userTable/UserTable';

function RejectRegister() {
    const [rejected, setRejected] = useState(null);
    const navigate = useNavigate();

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
                        {rejected && rejected.length > 0 ? (
                            <UserTable data={rejected} registrationState='notActive'/>
                        ) : (
                            <p>No Rejected registrations found</p>
                        )}
                    </div>
                </>
            ) : (
                <div className={styles.rejectLoader}>
                    <div className={styles.loader}></div>
                </div>
            )}
        </div>
    );
}

export default RejectRegister;