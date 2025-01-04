import React, { useEffect, useState } from 'react'
import { handleError, handleSuccess } from '../../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './EditConcreteStrength.module.css';
import Navbar from '../../../../../components/navbar/Navbar';
import Footer from '../../../../../components/footer/Footer';
import ConfirmationModal from '../../../../../components/ConfirmationModal/ConfirmationModal'; // Import the modal

function EditConcreteStrength() {
    const [supplierData, setSupplierData] = useState(null);
    const [editing, setEditing] = useState({});
    const [newEntry, setNewEntry] = useState({ concreteStrength: '', price: '' });
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [deleteConcreteStrength, setDeleteConcreteStrength] = useState(null); // Store the concrete strength to be deleted

    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('supplierProduct');
        localStorage.removeItem('role');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/supplier-login');
        }, 500);
    };

    const fetchSupplierData = async () => {
        try {
            const url = `http://localhost:8080/auth/supplier/supplier-data`;
            const headers = {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            };
            const response = await fetch(url, headers);
            const result = await response.json();
            setSupplierData(result);
            console.log(result)
        } catch (err) {
            handleError(err);
        }
    };

    const isNumeric = (value) => /^\d+(\.\d+)?$/.test(value);

    const handleStartEdit = (originalConcreteStrength, originalPrice) => {
        setEditing({
            originalConcreteStrength,
            concreteStrength: originalConcreteStrength,
            price: originalPrice,
        });
    };

    // Cancel
    const handleCancelEdit = () => {
        setEditing({});
    };

    // Edit 
    const handleEditChange = (field, value) => {
        if (field === 'concreteStrength' || field === 'price') {
            if (field && value && !isNumeric(value)) {
                handleError('The entered value must be a number');
                return;
            }
        }

        setEditing((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Save 
    const handleSaveEdit = () => {
        const updatedConcreteStrength = { ...supplierData.concreteStrength };

        if (!editing.concreteStrength || !editing.price) {
            handleError('Concrete Strength and Price cannot be empty');
            return;
        }

        if (editing.originalConcreteStrength !== editing.concreteStrength && updatedConcreteStrength[editing.concreteStrength]) {
            handleError('This Concrete Strength already exists');
            return;
        }

        if (editing.originalConcreteStrength !== editing.concreteStrength) {
            delete updatedConcreteStrength[editing.originalConcreteStrength];
        }

        updatedConcreteStrength[editing.concreteStrength] = Number(editing.price);
        setSupplierData({ ...supplierData, concreteStrength: updatedConcreteStrength });
        setEditing({});
    };

    // Delete 
    const handleDelete = (concreteStrength) => {
        setDeleteConcreteStrength(concreteStrength); // Set concrete strength to be deleted
        setShowModal(true); // Show the confirmation modal
    };

    const confirmDelete = () => {
        const updatedConcreteStrength = { ...supplierData.concreteStrength };
        delete updatedConcreteStrength[deleteConcreteStrength];
        setSupplierData({ ...supplierData, concreteStrength: updatedConcreteStrength });
        setShowModal(false); // Close the modal after deletion
    };

    const cancelDelete = () => {
        setShowModal(false); // Close the modal without deletion
    };

    const handleNewEntryChange = (field, value) => {
        if (field && value && !isNumeric(value)) {
            handleError('The entered value must be a number');
            return;
        }

        setNewEntry((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Add new concrete strength
    const handleAdd = () => {
        if (!newEntry.concreteStrength || !newEntry.price) {
            handleError('Both Concrete Strength and Price are required');
            return;
        }

        if (supplierData.concreteStrength[newEntry.concreteStrength]) {
            handleError('This Concrete Strength already exists');
            return;
        }

        const updatedConcreteStrength = {
            ...supplierData.concreteStrength,
            [newEntry.concreteStrength]: Number(newEntry.price),
        };

        setSupplierData({ ...supplierData, concreteStrength: updatedConcreteStrength });
        setNewEntry({ concreteStrength: '', price: '' });
    };

    // Update existing concrete strength
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const updatedData = { concreteStrength: supplierData.concreteStrength };
            const response = await fetch('http://localhost:8080/auth/supplier/update-concrete-strength', {
                method: 'PUT',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData),
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/supplier/concrete/profile");
                }, 500);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    };   

    useEffect(() => {
        fetchSupplierData();
    }, []);

    return(
        <section className={styles.editConcreteStrengthBody}>
            <Navbar 
                two="Orders"
                two1="Under preparing orders"
                pathTwo1="/supplier/concrete/under-preparing-orders"
                two2="Pending orders"
                pathTwo2="/supplier/concrete/pending-orders"
                two3="Old orders"
                pathTwo3="/supplier/concrete/old-orders"
                four="Profile"
                pathFour="/supplier/concrete/profile"
                logout={handleLogout}
            />
            
            {supplierData ? (
                <div className={styles.editConcreteStrengthContainer}>
                    <div className={styles.editConcreteStrengthRow}>
                        <h1 className={styles.editConcreteStrengthH1}>Edit Concrete Strength</h1>
                        <form className={styles.editConcreteStrengthForm} onSubmit={(e) => e.preventDefault()}>
                            {Object.entries(supplierData.concreteStrength).map(([key, value]) => (
                                <div key={key} className={styles.editConcreteStrengthDiv}>
                                    {editing.originalConcreteStrength === key ? (
                                        <>
                                            <input
                                                className={styles.editConcreteStrengthInput}
                                                value={editing.concreteStrength}
                                                onChange={(e) => handleEditChange('concreteStrength', e.target.value)}
                                                placeholder="Concrete strength"
                                            />
                                            <input
                                                className={styles.editConcreteStrengthInput}
                                                value={editing.price}
                                                onChange={(e) => handleEditChange('price', e.target.value)}
                                                placeholder="Price"
                                            />
                                            <button
                                                className={styles.editConcreteStrengthButton}
                                                type="button"
                                                onClick={handleSaveEdit}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className={styles.editConcreteStrengthButton}
                                                type="button"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className={styles.editConcreteStrengthSpan}>{`${key}: ${value}`}</span>
                                            <button
                                                className={styles.editConcreteStrengthButton}
                                                type="button"
                                                onClick={() => handleStartEdit(key, value)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={styles.editConcreteStrengthButton}
                                                type="button"
                                                onClick={() => handleDelete(key)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                            
                            {/* Add new entry section */}
                            <div className={styles.editConcreteStrengthDiv}>
                                <input
                                    className={styles.editConcreteStrengthInput}
                                    placeholder="New concrete strength"
                                    value={newEntry.concreteStrength}
                                    onChange={(e) => handleNewEntryChange('concreteStrength', e.target.value)}
                                />
                                <input
                                    className={styles.editConcreteStrengthInput}
                                    placeholder="New price"
                                    value={newEntry.price}
                                    onChange={(e) => handleNewEntryChange('price', e.target.value)}
                                />
                                <button
                                    className={styles.editConcreteStrengthButton}
                                    type="button"
                                    onClick={handleAdd}
                                >
                                    Add
                                </button>
                            </div>
                            
                            <button
                                className={styles.editConcreteStrengthButtonUpdate}
                                type="button"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className={styles.editConcreteStrengthContainer}>
                    <div className={styles.loader}></div>
                </div>
            )}

            {showModal && (
                <ConfirmationModal
                    message={`Are you sure you want to delete the concrete strength: ${deleteConcreteStrength}?`}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}

            <Footer 
                two="Orders"
                two1="Under preparing orders"
                pathTwo1="/supplier/concrete/under-preparing-orders"
                two2="Pending orders"
                pathTwo2="/supplier/concrete/pending-orders"
                two3="Old orders"
                pathTwo3="/supplier/concrete/old-orders"
                four="Profile"
                pathFour="/supplier/concrete/profile"
                logout={handleLogout}
            />
            <ToastContainer />
        </section>
    );
}

export { EditConcreteStrength };