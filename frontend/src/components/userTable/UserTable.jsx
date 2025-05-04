import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import styles from './UserTable.module.css';

const UserTable = (props) => {
    const navigate = useNavigate();

    const handleView = (id, role) => {
        navigate('/admin/user', { state: { id: id, registrationState: props.registrationState, role: role } });
    }

    const prepareRows = () => {
        if (!props.data) return [];
        
        return props.data.map((user) => ({
            id: user._id,
            ID: user.ID,
            name: user.name,
            role: user.role,
            supplierProduct: user.supplierProduct,
            originalData: user
        }));
    };

    const columns = [
        { field: 'ID', headerName: 'ID', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'name', headerName: 'Name', width: 150, headerAlign: 'center', align: 'center' },
        { 
            field: 'role', 
            headerName: 'Role', 
            width: 100, 
            headerAlign: 'center', 
            align: 'center',
            renderCell: (params) => {
                const role = params.value;
                return (
                    <span className={styles.role}>
                        {role}
                    </span>
                );
            } 
        },
        { 
            field: 'supplierProduct', 
            headerName: 'Product', 
            width: 150, 
            headerAlign: 'center', 
            align: 'center',
            renderCell: (params) => {
                const product = params.value;
                return (
                    <span className={styles.product}>
                        {product ? product : '--'}
                    </span>
                );
            } 
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            disableColumnMenu: true,
            sortable: false,
            renderCell: (params) => (
                <button className={styles.btnView} onClick={() => handleView(params.row.id)}>View</button>
            ),
        }
    ];

    const prepareRowsSupplier = () => {
        if (!props.data) return [];
        
        return props.data.map((user) => ({
            id: user._id,
            supplierID: user.supplierID,
            supplierName: user.supplierName,
            supplierProduct: user.supplierProduct,
            role: user.role,
            originalData: user
        }));
    };

    const columnsSupplier = [
        { field: 'supplierID', headerName: 'ID', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'supplierName', headerName: 'Name', width: 150, headerAlign: 'center', align: 'center' },
        { 
            field: 'supplierProduct', 
            headerName: 'Product', 
            width: 150, 
            headerAlign: 'center', 
            align: 'center',
            renderCell: (params) => {
                const product = params.value;
                return (
                    <span className={styles.product}>
                        {product ? product : '--'}
                    </span>
                );
            } 
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            disableColumnMenu: true,
            sortable: false,
            renderCell: (params) => (
                <button className={styles.btnView} onClick={() => handleView(params.row.id, params.row.role)}>View</button>
            ),
        }
    ];
    const prepareRowsCompany = () => {
        if (!props.data) return [];
        
        return props.data.map((user) => ({
            id: user._id,
            companyID: user.companyID,
            companyName: user.companyName,
            role: user.role,
            originalData: user
        }));
    };

    const columnsCompany = [
        { field: 'companyID', headerName: 'ID', width: 150, headerAlign: 'center', align: 'center', flex: 1 },
        { field: 'companyName', headerName: 'Name', width: 150, headerAlign: 'center', align: 'center', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            disableColumnMenu: true,
            sortable: false,
            renderCell: (params) => (
                <button className={styles.btnView} onClick={() => handleView(params.row.id, params.row.role)}>View</button>
            ),
        }
    ];

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <div className={styles.tableContainer}>
            <Paper style={{ width: '100%'}}>
                <DataGrid
                    rows={
                        props.role === 'supplier' ? prepareRowsSupplier()
                            : props.role === 'company' ? prepareRowsCompany()
                                : prepareRows()
                    }
                    columns={
                        props.role === 'supplier' ? columnsSupplier 
                            : props.role === 'company' ? columnsCompany 
                                : columns
                    }
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    disableColumnResize
                    disableColumnSelector
                    disableRowSelectionOnClick
                    disableVirtualization  
                />
            </Paper>
        </div>
    );
}

export default UserTable;
