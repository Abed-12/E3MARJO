import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RegisterModel from '../Models/UserRegistration.js';
import SupplierModel from '../Models/Supplier.js'
import env from "dotenv";
import fs from "node:fs";

env.config();
const registration = async (req, res) => {
    // console.log(req.body);
    // console.log(req.commercialRegister);
    // console.log(req.body.commercialRegister);
    try {
        const { supplierName, email, supplierID, supplierPhone, password, supplierProduct, commercialRegister } = req.body;
        const checkSupplier = await SupplierModel.findOne({
            $or: [{ supplierName }, { supplierID }]
        });

        if (checkSupplier) {
            return res.status(409).json({message: 'Supplier already exists', success: false});
        }

        const newUser = new RegisterModel({ supplierName, email, username, supplierPhone, password, supplierProduct, commercialRegister,role });
        newUser.password = await bcrypt.hash(password, 10);
        // supplierModel.commercialRegister = Buffer.from(commercialRegister, 'base64').toString('utf8');
        

        await newUser.save();

        res.status(201).json({
            message: "Registration successful",
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error: " + err.message,
            success: false
        });
    }
};

const login = async (req, res) => {
    try {
        const {supplierID, password} = req.body;
        const supplier = await SupplierModel.findOne({supplierID});
        const errorMsg = 'Auth failed supplierID or password is wrong';
        if (!supplier) {
            return res.status(403)
                .json({message: errorMsg, success: false});
        }

        const isPassEqual = await bcrypt.compare(password, supplier.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({message: errorMsg, success: false});
        }
        const jwtToken = jwt.sign(
            {
                supplierName: supplier.supplierName,
                email: supplier.email,
                supplierID: supplier.supplierID,
                supplierPhone: supplier.supplierPhone,
                supplierProduct: supplier.supplierProduct,
                role: supplier.role,
                _id: supplier._id
            }, // يحتوي على المعلومات التي تريد تضمينها
            process.env.JWT_SECRET, // هو مفتاح سري يستخدم لتوقيع الرمز
            {expiresIn: '24h'} // optional ---> الرمز سينتهي بعد 24 ساعه من انشائه
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                role: supplier.role,
                supplierProduct: supplier.supplierProduct
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror:" + err,
                success: false
            })
    }
}

export {registration, login};
