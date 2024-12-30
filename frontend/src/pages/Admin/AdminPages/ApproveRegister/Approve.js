import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Approve.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import { handleSuccess, handleError } from '../../../../utils/utils';
import {saveAs} from 'file-saver';

function ApproveRegister()
{
    const navigate = useNavigate();
    const [companies, setCompanies] = useState(null); // Initialize as an empty array
    const [suppliers, setSuppliers] = useState(null); // Initialize as an empty array

    useEffect(() => {
        const getData = async () => {
            try 
            {
                const  supplierData = await fetchSuppliersdata();
                const  companyData  = await fetchCompaniesData();
                setSuppliers(supplierData || []); // Ensure fallback to an empty array if data is null/undefined
                setCompanies(companyData || []); // Ensure fallback to an empty array if data is null/undefined
            } 
            catch (error) 
            {
                console.error("Failed to fetch companies and suppliers:", error);
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
        };

        async function fetchCompaniesData()
        {   
            try
            {
                    const companyResponse = await fetch('http://localhost:8080/auth/company/companyData', 
                    {
                        method: 'GET',
                        headers: { Authorization: localStorage.getItem('token') },
                    });
                    if (!companyResponse.ok)  {throw new Error('Failed to fetch company ');}
                    const companyData  = await companyResponse.json();
                    return await companyData;
            }catch (error)
            {
                console.error('Failed to fetch company data:', error);
                return{ companyData:[]};// Return an empty array in case of error
            }
        };
        async function fetchSuppliersdata() 
        {
            try {
                    const supplierResponse = await fetch('http://localhost:8080/auth/supplier/supplierData', 
                    {
                        method: 'GET',
                        headers: { Authorization: localStorage.getItem('token') },
                    });
                    if (!supplierResponse.ok) {throw new Error('Failed to fetch suppliers ');}
                    const supplierData = await supplierResponse.json();        
                    return await supplierData;
                } catch (error) 
                {
                    console.error(error.message);
                    return { supplierData: []} ;// Return an empty array in case of error
                }
        };
        async function deleteCompany(companyID) 
        {
            try
            {
                const confirmDrop = window.confirm('Are you sure you want to drop this user?');
                if (!confirmDrop) return;
                const response = await fetch(`http://localhost:8080/auth/company/delete/${companyID}`,
                    {
                        method: 'DELETE',
                        headers: { Authorization: localStorage.getItem('token') },
                    });
                    if (response.ok) {
                        setCompanies(deleteCompany => deleteCompany.filter(company => company.companyID !== companyID));
                        handleSuccess('Company deleted successfully '); // Show success message
                    } else {
                        console.error('Failed to delete company:', response.statusText);
                    }
            }catch(error)
            {
                console.error('Failed to delete company:', error);
            }
        };
        async function deleteSupplier(supplierId) 
        {
            const confirmDrop = window.confirm('Are you sure you want to drop this user?');
            if (!confirmDrop) return;
            try
            {
                const response = await fetch(`http://localhost:8080/auth/supplier/delete/${supplierId}`,
                    {
                        method: 'DELETE',
                        headers: { Authorization: localStorage.getItem('token') },
                    });
                    if (response.ok) {
                        setSuppliers(deleteSupplier => deleteSupplier.filter(supplier => supplier.supplierID !== supplierId));
                        handleSuccess('supplier deleted successfully '); // Show success message
                    } else {
                        console.error('Failed to delete supplier:', response.statusText);
                    }
            }catch(error)
            {
                console.error('Failed to delete supplier:', error);
            }
        };
        async function companyDownloadCommercialRegisterPdf(ID) 
                {
                    try 
                    {
                        const url = `http://localhost:8080/auth/company/admin-commercial-register/${ID}`;
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
            
        };
        async function supplierDownloadCommercialRegisterPdf (ID)
            {
                try 
                {
                    const url = `http://localhost:8080/auth/supplier/admin-commercial-register/${ID}`;
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
                                <p>
                                    <strong>Supplier name:</strong> {field.supplierName} 
                                </p>
                                <p>
                                    <strong>Supplier email:</strong> {field.email} 
                                </p>
                                <p>
                                    <strong>Supplier ID:</strong> {field.supplierID} 
                                </p>
                                <p>
                                    <strong>Supplier phone:</strong> {field.supplierPhone} 
                                </p>
                                <p>
                                    <strong>Supplier product:</strong> {field.supplierProduct} 
                                </p>
                                <div>
                                <p>
                                    {field.supplierProduct === "concrete" ? (
                                        // Handle the object display for concrete
                                        <div>
                                            <strong>Supplier strength/price:</strong>{" "}
                                            {Object.entries(field.cementBreakingStrength).map(([strength, price]) => (
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
                                </p>
                                </div>
                                <p><strong>Commercial register:</strong>  
                                    <button className={styles.approveDownloadButton} onClick={() => supplierDownloadCommercialRegisterPdf(field.supplierID)}>Download PDF</button>  
                                </p> 
                                <p>
                                    <strong>Admin name:</strong> {field.adminName} 
                                </p>
                                
                                <button
                                    className={styles.pendingButtonDrop}
                                    onClick={() => deleteSupplier(field.supplierID)}
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
                                <p>
                                    <strong>Company name:</strong> {field.companyName} 
                                </p>
                                <p>
                                    <strong>Company email:</strong> {field.email} 
                                </p>
                                <p>
                                    <strong>Company ID:</strong> {field.companyID} 
                                </p>
                                <p>
                                    <strong>Company phone:</strong> {field.companyPhone} 
                                </p>
                                <p><strong>Commercial register:</strong>  
                                    <button className={styles.approveDownloadButton} onClick={() => companyDownloadCommercialRegisterPdf(field.companyID)}>Download PDF</button> 
                                </p>
                                <p>
                                <strong>Admin name:</strong> {field.adminName} 
                                </p>
                                <button
                                    className={styles.pendingButtonDrop}
                                    onClick={() => deleteCompany(field.companyID)}
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

            <ToastContainer />

    </div>
    );
    
}
export default ApproveRegister;