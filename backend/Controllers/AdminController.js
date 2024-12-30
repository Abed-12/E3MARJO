import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminModel from "../Models/Admin.js";
import env from "dotenv";

env.config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminModel.findOne({ email });
        const errorMsg = 'Auth failed: email or password is wrong';

        const errorMsg = 'Auth failed: email or password is wrong';

        if (!admin) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, admin.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const jwtToken = jwt.sign(
            { email: admin.email, _id: admin._id, role: admin.role }, // Include details to include in JWT
            process.env.JWT_SECRET, // Secret key for signing JWT
            { expiresIn: '24h' } // Token expiration
            { email: admin.email, _id: admin._id, role: admin.role }, // Include details to include in JWT
            process.env.JWT_SECRET, // Secret key for signing JWT
            { expiresIn: '24h' } // Token expiration
        );

        res.status(200).json({
            message: "Login Success",
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            email,
            role: admin.role
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error: " + err.message,
            message: "Internal server error: " + err.message,
            success: false
        });
    }
};

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const errorMsgPassword = 'You forgot to add a password';
        const errorMsgEmail = 'You forgot to add an email';
        const errorMsgEmailExists = 'Email already exists';

        if (!password) {
            return res.status(403).json({ message: errorMsgPassword, success: false });
        }

        if (!email) {
            return res.status(403).json({ message: errorMsgEmail, success: false });
        const { email, password } = req.body;
        const errorMsgPassword = 'You forgot to add a password';
        const errorMsgEmail = 'You forgot to add an email';
        const errorMsgEmailExists = 'Email already exists';

        if (!password) {
            return res.status(403).json({ message: errorMsgPassword, success: false });
        }

        if (!email) {
            return res.status(403).json({ message: errorMsgEmail, success: false });
        }

        const adminExists = await AdminModel.findOne({ email });
        const adminExists = await AdminModel.findOne({ email });
        if (adminExists) {
            return res.status(409).json({ message: errorMsgEmailExists, success: false });
            return res.status(409).json({ message: errorMsgEmailExists, success: false });
        }



        const newAdmin = new AdminModel({ email, password: await bcrypt.hash(password, 10) });
        const newAdmin = new AdminModel({ email, password: await bcrypt.hash(password, 10), });
        await newAdmin.save();

        res.status(201).json({
            message: "Admin added successfully",
            message: "Admin added successfully",
            success: true
        });

    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message, success: false });
    }  

    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message, success: false });
    }  
};

export { login, register };
