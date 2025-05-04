import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './request.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import { handleSuccess} from '../../../../utils/utils';
import UserTable from '../../../../components/userTable/UserTable.jsx';

function RequestRegister() {
    const navigate = useNavigate();

    const [pending, setPending] = useState(null); // Initialize as an empty array

    useEffect(() => {
        const getData = async () => {
            try {
                const pendingData = await fetchData(); // Fetch company data
                setPending(pendingData || []); // Ensure fallback to an empty array if data is null/undefined
            } catch (error) {
                console.error("Failed to fetch pending request:", error);
            }
        };

        getData();
    }, []); 

const handleLogout = (e) =>
    {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => 
        {
            navigate('/admin');
        }, 500)
    }

    async function fetchData()
    {
        try
        {
            const response = await fetch('http://localhost:8080/auth/register/fetchRegistrationData?status=new',
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

            {pending ? (
                <>
                    <h2 className={styles.List}>Pending Registration:</h2>
                    <div className={styles.profileContainer}>
                        {pending && pending.length > 0 ? (
                            <UserTable data={pending} registrationState='notActive'/>
                        ) : (
                            <p>No Pending registrations found</p>
                        )}
                    </div>
                </>
            ) : (
                <div className={styles.requestLoader}>
                    <div className={styles.loader}></div>
                </div>
            )}

        </div>
    );
    
};
export default RequestRegister;