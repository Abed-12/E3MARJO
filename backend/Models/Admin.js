import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const AdminSchema = new mongoose.Schema({
    adminName:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'admin',
    }
});

AdminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const AdminModel = mongoose.model('admin', AdminSchema);

const admin = new AdminModel({
    adminName: 'Abed',
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin"
});
// admin.save()

export default AdminModel;