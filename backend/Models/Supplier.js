import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema({
    supplierName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    supplierID: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    supplierPhone: {
        type: String,
        required: true
    },
    supplierProduct: {
        type: String,
        required: true
    },
    commercialRegister: {
        type: Buffer, // Store the file as binary data
        // contentType: String, // Store the MIME type (e.g., application/pdf)
        required: true
    },
    price:{
        type:Number,
        default: 5
    },
    role: {
        type: String,
        default:"supplier"
    },    
    adminID: {
        type: String,
        default: 'admin'
    }
});

const SupplierModel = mongoose.model('suppliers', SupplierSchema);


export default SupplierModel;