import React from 'react';
import moment from 'moment';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import styles from './OrderTable.module.css';

const OrderTable = (props) => {
    const role = localStorage.getItem('role');
    const supplierProduct = localStorage.getItem('supplierProduct');
    
    const navigate = useNavigate();
    
    const handleView = (id) => {
        if (role === 'supplier' && supplierProduct === 'cement') {
            navigate('/supplier/cement/order', { state: { id: id } });
        } else if (role === 'supplier' && supplierProduct === 'concrete') {
            navigate('/supplier/concrete/order', { state: { id: id } });
        } else if (role === 'company') {
            navigate('/company/home/order', { state: { id: id } });
        }
    }

    const prepareRows = () => {
        if (!props.filteredOrders) return [];
        
        return props.filteredOrders.map((order, index) => ({
            id: order.id,
            supplierName: order.supplierName,
            companyName: order.companyName,
            type: order.type,
            status: order.status,
            quantity: order.type === 'cement' ? `${order.cementQuantity} ton` : `${order.concreteQuantity} m³`,
            deliveryTime: moment(order.deliveryTime * 1000).format('D/MM/YYYY - h:mm a'),
            price: `${order.price} JD`,
            originalData: order
        }));
    };

    const columns = [
        { field: 'supplierName', headerName: 'Supplier Name', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'companyName', headerName: 'Company Name', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'type', headerName: 'Type', width: 100, headerAlign: 'center', align: 'center' },
        { 
            field: 'status', 
            headerName: 'Status', 
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <span className={`${styles.status} ${styles[params.value]}`}>
                    {params.value === 'under_preparing' ? 'Under Preparing' : params.value}
                </span>
            ),
        },
        { field: 'quantity', headerName: 'Quantity', width: 120, headerAlign: 'center', align: 'center' },
        { field: 'deliveryTime', headerName: 'Delivery Time', width: 180, headerAlign: 'center', align: 'center' },
        { field: 'price', headerName: 'Price', width: 100, headerAlign: 'center', align: 'center' },
        {
            field: 'actions',
            headerName: 'Actions',
            headerAlign: 'center',
            align: 'center',
            disableColumnMenu: true,
            sortable: false,
            renderCell: (params) => (
                <button className={styles.btnView} onClick={() => handleView(params.row.id)}>View</button>
            ),
        }
    ];

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <div className={styles.tableContainer}>
            <Paper style={{ maxWidth: '100%', borderRadius: '20px', overflow: 'hidden'}}>
                <DataGrid
                    className={styles.dataGrid}
                    rows={prepareRows()}
                    columns={columns}
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

export default OrderTable;
