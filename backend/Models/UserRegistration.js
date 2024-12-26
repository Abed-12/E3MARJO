import mongoose from 'mongoose';

const UserRegister = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    Id: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    Phone: {
        type: String,
        required: true
    },
    commercialRegister: {
        type: Buffer, // Store the file as binary data
        // contentType: String, // Store the MIME type (e.g., application/pdf)
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
    AdminEmail:{
        type: String,
        default:""
    }
    
});


const RegisterModel = mongoose.model('UserRegister', UserRegister);



export default RegisterModel ;

// const users = [
//     {
//         Name: "Al-Bayt Construction",
//         email: "info@albaytconstruction.jo",
//         Id: 1001001001,
//         password: "securePass123",
//         Phone: "0777123456",
//         commercialRegister: Buffer.from("Al-Bayt Construction Commercial Register"),
//         role: "company",
//         status: "new",
//     },
//     {
//         Name: "Al-Farid Cement Supplier",
//         email: "sales@alfaridcement.jo",
//         Id: 1001002002,
//         password: "securePass124",
//         Phone: "0788123456",
//         commercialRegister: Buffer.from("Al-Farid Cement Commercial Register"),
//         role: "supplier",
//         status: "new",
//         supplierProduct: "cement",
//     },
//     {
//         Name: "Jordan Build Co.",
//         email: "contact@jordanbuild.jo",
//         Id: 1001003003,
//         password: "securePass125",
//         Phone: "0799123456",
//         commercialRegister: Buffer.from("Jordan Build Co. Commercial Register"),
//         role: "company",
//         status: "new",
//     },
//     {
//         Name: "Petra Concrete Supply",
//         email: "info@petraconcrete.jo",
//         Id: 1001004004,
//         password: "securePass126",
//         Phone: "0788234567",
//         commercialRegister: Buffer.from("Petra Concrete Supply Commercial Register"),
//         role: "supplier",
//         status: "new",
//         supplierProduct: "concrete",
//     },
//     {
//         Name: "Amman Builders Ltd.",
//         email: "support@ammanbuilders.jo",
//         Id: 1001005005,
//         password: "securePass127",
//         Phone: "0799345678",
//         commercialRegister: Buffer.from("Amman Builders Ltd. Commercial Register"),
//         role: "company",
//         status: "new",
//     },
//     {
//         Name: "Zarqa Cement Solutions",
//         email: "sales@zarqacement.jo",
//         Id: 1001006006,
//         password: "securePass128",
//         Phone: "0788456789",
//         commercialRegister: Buffer.from("Zarqa Cement Solutions Commercial Register"),
//         role: "supplier",
//         status: "new",
//         supplierProduct: "cement",
//     },
// ];

// RegisterModel.insertMany(users);
