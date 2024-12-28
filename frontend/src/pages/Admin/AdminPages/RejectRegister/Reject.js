import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Reject.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import { handleSuccess, handleError } from '../../../../utils/utils';
import {saveAs} from 'file-saver';


function RejectRegister() {
    const navigate = useNavigate();
    const [rejected, setRejected] = useState([]); // Initialize as an empty array
    useEffect(() => {
        const getData = async () => 
        {
            try 
            {
                const rejectedData = await fetchdata(); // Fetch company data
                setRejected(rejectedData || []); // Ensure fallback to an empty array if data is null/undefined
            } 
            catch (error) 
            {
                console.error("Failed to fetch rejected data :", error);
            }
        };

        getData();
    }, []); // Runs once when the component mounts
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
    async function fetchdata()
    {
        try
        {
            const response = await fetch('http://localhost:8080/auth/register/fetchRegistrationData?status=rejected',
            {
                method:'GET',
                headers: { Authorization: localStorage.getItem('token') }
            });
            const data = await response.json();
            return data;
        }
        catch(err)
        {
            console.log(err.message);
        }
    }

    async function dropUser(Id) {
        // pop message for check about drop user
        const confirmDrop = window.confirm('Are you sure you want to drop this user?');
        if (!confirmDrop) return; // If the user clicks "Cancel", exit the function and API don't call
    
        try {
            const response = await fetch(`http://localhost:8080/auth/register/delete/${Id}`, {
                method: 'DELETE',
                headers: { Authorization: localStorage.getItem('token') },
            });
    
            if (response.ok) {
                setRejected(deleteUser => deleteUser.filter(user => user.ID !== Id));
                handleSuccess('User successfully dropped'); // Show success message
            } else {
                console.error('Failed to delete user:', response.statusText);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function downloadCommercialRegisterPdf(ID, name) 
    {
        try 
        {
            const url = `http://localhost:8080/auth/register/registration-commercial-register/${ID}`;
            const options = {
                method:'GET',
                headers: { Authorization: localStorage.getItem('token') }
            }
            const response = await fetch(url, options);
            const contentDisposition = response.headers.get('content-disposition');
            const filename = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : `${name}.pdf`;
            const file = await response.blob();
            saveAs(file, filename)
        } catch (err) {
            handleError(err);
        }

    }



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

            <h2 className={styles.List}>Rejcted Registration:</h2>
            <div className={styles.profileContainer}>   
            {(() => 
            {
                const rejectedUsers = Array.isArray(rejected) ? rejected : [];

                const filteredData = rejectedUsers.length > 0 ? 
                rejectedUsers.map((field) => 
                {
                    return (
                            <div className={styles.profileRow} key={field._id}>
                                <p><strong>{field.role === "company" ? "Company" : "Supplier"} name:</strong> {field.name}</p>
                                <p><strong>{field.role === "company" ? "Company" : "Supplier"} email:</strong> {field.email}</p>
                                <p><strong>{field.role === "company" ? "Company" : "Supplier"} ID:</strong> {field.ID}</p>
                                <p><strong>{field.role === "company" ? "Company" : "Supplier"} phone:</strong> {field.phone}</p>
                                {field.role === "supplier" ? 
                                (
                                    <p><strong>Supplier product:</strong> {field.supplierProduct}</p>
                                ) : (
                                    <strong></strong> 
                                    )
                                }
                            <p><strong>Commercial register:</strong> 
                                <button className={styles.rejectDownloadButton} onClick={() =>downloadCommercialRegisterPdf(field.ID, field.name)}>Download PDF</button> 
                            </p>                                
                            <p><strong>Admin email:</strong> {field.adminEmail} </p>
                                <button
                                    className={styles.pendingButtonDrop}
                                    onClick={() => dropUser(field.ID)}
                                >
                                    Drop
                                </button>
                            </div>
                    );
                
                return null;
            }) : 
            <p>No Pending registrations found.</p>;

        return filteredData;
    })()}
</div>
        </div>

    );
    
}
export default RejectRegister;