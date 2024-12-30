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
        );

        res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            role: admin.role
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error: " + err.message,
            success: false
        });
    }
};

const register = async (req, res) => {
    try {
        const { email, password, adminName } = req.body;
        const errorMsgPassword = 'You forgot to add a password';
        const errorMsgEmail = 'You forgot to add an email';
        const errorMsgName = 'You forgot to add a name';

        const errorMsgEmailExists = 'Email already exists';
        const errorMsgNameExists ='Name already exists';
        if (!password || !email || !adminName) {
            if (!password) return res.status(403).json({ message: errorMsgPassword, success: false });
            if (!email) return res.status(403).json({ message: errorMsgEmail, success: false });
            if (!adminName) return res.status(403).json({ message: errorMsgName, success: false });
        }

        const adminExists = await AdminModel.findOne({
            $or: // single database query instead of two
            [
                { email: email },
                { adminName: adminName }
            ]
        });

        if (adminExists) {
            const message = adminExists.email === email ? errorMsgEmailExists : errorMsgNameExists;
            return res.status(409).json({ message, success: false });
            }
        const newAdmin = new AdminModel({ email, password: await bcrypt.hash(password, 10), adminName });
        await newAdmin.save();

        res.status(201).json({
            message: "Admin added successfully",
            success: true
        });

    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message, success: false });
    }  
};

export { login, register };
