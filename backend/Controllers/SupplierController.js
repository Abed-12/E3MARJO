import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RegisterModel from '../Models/UserRegistration.js';
import SupplierModel from '../Models/Supplier.js'
import env from "dotenv";
import fs from "node:fs";
import UserOtpModel from "../Models/UserOtp.js";
import crypto from "node:crypto";
import {sendEmail} from "../Services/mail-sender.service.js";

env.config();
const registration = async (req, res) => {
    try {
        const {
            supplierName,
            email,
            supplierID,
            supplierPhone,
            password,
            supplierProduct,
            role
        } = JSON.parse(req.fields.body[0]);
        const filePath = req.files.commercialRegister[0].filepath;
        const commercialRegister = fs.readFileSync(filePath)
        const checkSupplier = await RegisterModel.findOne({
            $or: [{name: supplierName}, {ID: supplierID}]
        });

        if (checkSupplier) {
            return res.status(409).json({message: 'Supplier already exists', success: false});
        }

        const newUser = new RegisterModel({
            name: supplierName,
            email: email,
            ID: supplierID,
            phone: supplierPhone,
            password: await bcrypt.hash(password, 10),
            supplierProduct: supplierProduct,
            commercialRegister: commercialRegister,
            role: role
        });

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
        const supplier = await SupplierModel.findOne({supplierID: supplierID});
        let errorMessage = 'Auth failed supplierID or password is wrong';
        if (!supplier) {
            return res.status(403)
                .json({message: errorMessage, success: false});
        } else if (!await bcrypt.compare(password, supplier.password)) {
            return res.status(403)
                .json({message: errorMessage, success: false});
        }
        const allPreviousNewLoginOtp = await UserOtpModel.find({
            userId: supplier._id,
            userType: 'SUPPLIER',
            operationType: 'LOGIN',
            status: 'NEW'
        })
        allPreviousNewLoginOtp.forEach(previousOtp => {
            previousOtp.status = 'DENIED'
            previousOtp.save()
        })
        let newLoginOtp = await new UserOtpModel({
            userId: supplier._id,
            otp: crypto.randomInt(100000, 999999),
            userType: 'SUPPLIER',
            operationType: 'LOGIN',
            status: 'NEW'
        }).save();

        sendEmail(supplier.email, 'Login OTP', `Your login OTP is: ${newLoginOtp.otp}`, false)

        res.status(200)
            .json({
                success: true,
                userOtpId: newLoginOtp._id,
                otpRequired: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror:" + err,
                success: false
            })
    }
}

const loginOtp = async (req, res) => {
    try {
        const {id, otp} = req.body;
        const userOtp = await UserOtpModel.findOne({
            _id: id,
            otp: otp,
            operationType: 'LOGIN',
            userType: 'SUPPLIER',
            status: 'NEW'
        })
        if (!userOtp) {
            return res.status(403)
                .json({message: "Invalid OTP", success: false})
        }
        userOtp.status = 'USED'
        await userOtp.save()

        const supplier = await SupplierModel.findById(userOtp.userId);
        const jwtToken = jwt.sign(
            {
                supplierName: supplier.supplierName,
                email: supplier.email,
                supplierID: supplier.supplierID,
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

const enableOtp = async (req, res) => {
    try {
        const supplierId = jwt.decode(req.headers.authorization)._id
        const supplier = await SupplierModel.findOne({supplierID: supplierId});
        if (!supplier) {
            return res.status(403)
                .json({message: "Unauthorized Operation", success: false})
        }
        const allPreviousNewOtp = await UserOtpModel.find({
            userId: supplier._id,
            userType: 'SUPPLIER',
            operationType: 'ENABLE_2FA',
            status: 'NEW'
        })
        allPreviousNewOtp.forEach(previousOtp => {
            previousOtp.status = 'DENIED'
            previousOtp.save()
        })

        let newOtp = await new UserOtpModel({
            userId: supplier._id,
            otp: crypto.randomInt(100000, 999999),
            userType: 'SUPPLIER',
            operationType: 'ENABLE_2FA',
            status: 'NEW'
        }).save();

        sendEmail(supplier.email, 'Enable OTP', `Your enabling OTP is: ${newOtp.otp}`, false)

        res.status(200)
            .json({
                success: true,
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror:" + err,
                success: false
            })
    }
}

const enableOtpConfirm = async (req, res) => {
    try {
        const {otp} = req.body
        const supplierId = jwt.decode(req.headers.authorization)._id
        const supplier = await SupplierModel.findOne({supplierID: supplierId});
        if (!supplier) {
            return res.status(403)
                .json({message: "Unauthorized Operation", success: false})
        }
        const userOtp = await UserOtpModel.findOne({
            userId: supplier._id,
            otp: otp,
            userType: 'SUPPLIER',
            operationType: 'ENABLE_2FA',
            status: 'NEW'
        })
        if (!userOtp) {
            return res.status(403)
                .json({message: "Invalid OTP", success: false})
        }
        userOtp.status = 'USED'
        await userOtp.save()

        supplier.otpEnabled = true
        await supplier.save()

        res.status(200)
            .json({
                success: true,
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror:" + err,
                success: false
            })
    }
}

const disableOtp = async (req, res) => {
    try {
        const supplierId = jwt.decode(req.headers.authorization)._id
        const supplier = await SupplierModel.findOne({supplierID: supplierId});
        if (!supplier) {
            return res.status(403)
                .json({message: "Unauthorized Operation", success: false})
        }
        const allPreviousNewOtp = await UserOtpModel.find({
            userId: supplier._id,
            userType: 'SUPPLIER',
            operationType: 'DISABLE_2FA',
            status: 'NEW'
        })
        allPreviousNewOtp.forEach(previousOtp => {
            previousOtp.status = 'DENIED'
            previousOtp.save()
        })

        let newOtp = await new UserOtpModel({
            userId: supplier._id,
            otp: crypto.randomInt(100000, 999999),
            userType: 'SUPPLIER',
            operationType: 'DISABLE_2FA',
            status: 'NEW'
        }).save();

        sendEmail(supplier.email, 'Disable OTP', `Your disabling OTP is: ${newOtp.otp}`, false)

        res.status(200)
            .json({
                success: true,
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror:" + err,
                success: false
            })
    }
}

const disableOtpConfirm = async (req, res) => {
    try {
        const {otp} = req.body
        const supplierId = jwt.decode(req.headers.authorization)._id
        const supplier = await SupplierModel.findOne({supplierID: supplierId});
        if (!supplier) {
            return res.status(403)
                .json({message: "Unauthorized Operation", success: false})
        }
        const userOtp = await UserOtpModel.findOne({
            userId: supplier._id,
            otp: otp,
            userType: 'SUPPLIER',
            operationType: 'DISABLE_2FA',
            status: 'NEW'
        })
        if (!userOtp) {
            return res.status(403)
                .json({message: "Invalid OTP", success: false})
        }
        userOtp.status = 'USED'
        await userOtp.save()

        supplier.otpEnabled = false
        await supplier.save()

        res.status(200)
            .json({
                success: true,
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror:" + err,
                success: false
            })
    }
}

export {registration, login, loginOtp, enableOtp, enableOtpConfirm, disableOtp, disableOtpConfirm};