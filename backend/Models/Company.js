import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    companyID: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    companyPhone: {
        type: String,
        required: true
    },
    commercialRegister: {
        type: Buffer,
        required: true
    },
    role: {
        type: String,
        default: 'company'
    },    
    adminID: {
        type: String,
        default: 'admin'
    },
    otpEnabled: {
        type: Boolean,
        default: false
    },
    status :{
        type:String,
        default:"Active"
    }
});

const CompanyModel = mongoose.model('company', CompanySchema);



export default CompanyModel;