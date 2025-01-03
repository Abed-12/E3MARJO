import mongoose from 'mongoose';

const UserRegister = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    ID: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    commercialRegister: {
        type: Buffer,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['supplier', 'company']
    },
    status: {
        type: String,
        default: "new"
    },
    supplierProduct: {
        type: String,
        required: function () {
            return this.role === 'supplier'; // Only required for suppliers
        },
    },
    adminID: {
        type: String,
        default: "none"
    }

});


const RegisterModel = mongoose.model('UserRegister', UserRegister);



export default RegisterModel;