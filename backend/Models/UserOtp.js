import mongoose from 'mongoose';

const UserOtpSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
        enum: ['COMPANY', 'SUPPLIER']
    },
    operationType: {
        type: String,
        required: true,
        enum: ['LOGIN']
    },
    status: {
        type: String,
        required: true,
        enum: ['NEW', 'USED', 'DENIED']
    }
});


const UserOtpModel = mongoose.model('userOtp', UserOtpSchema);

export default UserOtpModel;