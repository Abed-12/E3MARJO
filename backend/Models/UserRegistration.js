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
        default: ""
    }

});


const RegisterModel = mongoose.model('UserRegister', UserRegister);



export default RegisterModel;
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
//     // New entries
//     {
//         name: "Amman Builders Elite",
//         email: "info@ammanbuilders.jo",
//         ID: 9001001001,
//         password: "securePass127",
//         phone: "0791234567",
//         commercialRegister: Buffer.from("Amman Builders Elite Commercial Register"),
//         role: "company",
//         status: "new",
//         adminID: "none"
//     },
//     {
//         name: "Zarqa Cement Supply",
//         email: "info@zarqacement.jo",
//         ID: 9001001002,
//         password: "securePass128",
//         phone: "0781234567",
//         supplierProduct: "cement",
//         commercialRegister: Buffer.from("Zarqa Cement Supply Commercial Register"),
//         role: "supplier",
//         status: "new",
//         adminID: "none"
//     },
//     {
//         name: "Irbid Construction Co",
//         email: "contact@irbidconstruct.jo",
//         ID: 9001001003,
//         password: "securePass129",
//         phone: "0771234567",
//         commercialRegister: Buffer.from("Irbid Construction Commercial Register"),
//         role: "company",
//         status: "new",
//         adminID: "none"
//     },
//     {
//         name: "Aqaba Concrete Solutions",
//         email: "sales@aqabaconcrete.jo",
//         ID: 9001001004,
//         password: "securePass130",
//         phone: "0781234568",
//         supplierProduct: "concrete",
//         commercialRegister: Buffer.from("Aqaba Concrete Commercial Register"),
//         role: "supplier",
//         status: "new",
//         adminID: "none"
//     },
//     {
//         name: "Salt Building Masters",
//         email: "info@saltbuilders.jo",
//         ID: 9001001005,
//         password: "securePass131",
//         phone: "0791234568",
//         commercialRegister: Buffer.from("Salt Building Masters Commercial Register"),
//         role: "company",
//         status: "new",
//         adminID: "none"
//     },
//     {
//         name: "Madaba Cement Factory",
//         email: "info@madabacement.jo",
//         ID: 9001001006,
//         password: "securePass132",
//         phone: "0781234569",
//         supplierProduct: "cement",
//         commercialRegister: Buffer.from("Madaba Cement Factory Commercial Register"),
//         role: "supplier",
//         status: "new",
//         adminID: "none"
//     },
//     {
//         name: "Karak Construction Group",
//         email: "info@karakconstruct.jo",
//         ID: 9001001007,
//         password: "securePass133",
//         phone: "0771234569",
//         commercialRegister: Buffer.from("Karak Construction Group Commercial Register"),
//         role: "company",
//         status: "new",
//         adminID: "none"
//     },
//     {
//         name: "Ajloun Concrete Masters",
//         email: "sales@ajlourconcrete.jo",
//         ID: 9001001008,
//         password: "securePass134",
//         phone: "0781234570",
//         supplierProduct: "concrete",
//         commercialRegister: Buffer.from("Ajloun Concrete Masters Commercial Register"),
//         role: "supplier",
//         status: "new",
//         adminID: "none"
//     },
//     {
//         name: "Jerash Builders Co",
//         email: "contact@jerashbuilders.jo",
//         ID: 9001001009,
//         password: "securePass135",
//         phone: "0791234570",
//         commercialRegister: Buffer.from("Jerash Builders Co Commercial Register"),
//         role: "company",
//         status: "new",
//         adminID: "none"
//     }
//  ];
 
//   RegisterModel.insertMany(users);