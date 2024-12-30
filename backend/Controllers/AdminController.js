import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminModel from "../Models/Admin.js";
import env from "dotenv";

env.config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const errorMsg = 'Authentication failed: email or password is incorrect';

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required", success: false });
        }

        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, admin.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const jwtToken = jwt.sign(
            { email: admin.email, _id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email: admin.email,
            role: admin.role
        });
    } catch (err) {
        res.status(500).json({
            message: `Internal server error: ${err.message}`,
            success: false
        });
    }
};

const register = async (req, res) => {
    try {
        const { email, password, adminName } = req.body;

        if (!email || !password || !adminName) {
            const missingFields = [];
            if (!email) missingFields.push('email');
            if (!password) missingFields.push('password');
            if (!adminName) missingFields.push('name');
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`,
                success: false
            });
        }

        const adminExists = await AdminModel.findOne({
            $or: [{ email }, { adminName }]
        });

        if (adminExists) {
            const conflictField = adminExists.email === email ? 'email' : 'name';
            return res.status(409).json({
                message: `The ${conflictField} already exists`,
                success: false
            });
        }

        const newAdmin = new AdminModel({ email, password: await bcrypt.hash(password, 10), adminName });

        await newAdmin.save();

        res.status(201).json({
            message: "Admin registered successfully",
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: `Internal server error: ${err.message}`,
            success: false
        });
    }
};


export { login, register };
