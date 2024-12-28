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
        type:String,
        default:"new"
    },
    supplierProduct: {
        type: String,
        required: function () 
        {
            return this.role === 'supplier'; // Only required for suppliers
        },
    },
    adminID:{
        type: String,
        default:""
    }
    
});


const RegisterModel = mongoose.model('UserRegister', UserRegister);



export default RegisterModel ;

// const users = [
//     {
//         name: "Al-Bayt Construction",
//         email: "info@albaytconstruction.jo",
//         ID: 1001001001,
//         password: "securePass123",
//         phone: "0777123456",
//         commercialRegister: Buffer.from("Al-Bayt Construction Commercial Register"),
//         role: "company",
//         status: "new",
//         adminID: "none"
//     },
//     {
//         name: "Al-Farid Cement Supplier",
//         email: "sales@alfaridcement.jo",
//         ID: 1001002002,
//         password: "securePass124",
//         phone: "0788123456",
//         commercialRegister: Buffer.from("Al-Farid Cement Commercial Register"),
//         role: "supplier",
//         status: "new",
//         supplierProduct: "cement",
//         adminID: "none"
//     },
//     {
//         name: "Jordan Build Co.",
//         email: "contact@jordanbuild.jo",
//         ID: 1001003003,
//         password: "securePass125",
//         phone: "0799123456",
//         commercialRegister: Buffer.from("Jordan Build Co. Commercial Register"),
//         role: "company",
//         status: "new",
//         adminID: "none"
//     },
//     {
//         name: "Petra Concrete Supply",
//         email: "info@petraconcrete.jo",
//         ID: 1001004004,
//         password: "securePass126",
//         phone: "0788234567",
//         commercialRegister: Buffer.from("Petra Concrete Supply Commercial Register"),
//         role: "supplier",
//         status: "new",
//         supplierProduct: "concrete",
//         adminID: "none"
//     }
// ];

// RegisterModel.insertMany(users);
