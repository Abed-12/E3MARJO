import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CompanyModel from "../Models/Company.js";
import RegisterModel from "../Models/UserRegistration.js";
import env from "dotenv";
import * as fs from "node:fs";
import UserOtpModel from "../Models/UserOtp.js";
import {sendEmail} from "../Services/mail-sender.service.js";
import crypto from "node:crypto";

env.config();

const registration = async (req, res) => {
    try {
        const {companyName, email, companyID, password, companyPhone, role} = JSON.parse(req.fields.body[0]);
        const filePath = req.files.commercialRegister[0].filepath;
        const commercialRegister = fs.readFileSync(filePath)

        // Check if the company already exists
        const checkCompany = await RegisterModel.findOne({
            $or: [{name: companyName}, {ID: companyID}]
        });

        if (checkCompany) {
            return res.status(406)
                .json({message: 'Company already exists', success: false});
        }
        // Create a new user object with proper field mappings
        const newUser = new RegisterModel({
            name: companyName,
            email: email,
            ID: companyID,
            password: await bcrypt.hash(password, 10),
            phone: companyPhone,
            commercialRegister: commercialRegister,
            role: role
        });

        // Save the new user to the database
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
        const {companyID, password} = req.body;
        const company = await CompanyModel.findOne({companyID: companyID});
        let errorMessage = 'Auth failed companyID or password is wrong';
        if (!company) {
            return res.status(403)
                .json({message: errorMessage, success: false});
        } else if (!await bcrypt.compare(password, company.password)) {
            return res.status(403)
                .json({message: errorMessage, success: false});
        }
        const allPreviousNewLoginOtp = await UserOtpModel.find({
            userId: company._id,
            userType: 'COMPANY',
            operationType: 'LOGIN',
            status: 'NEW'
        })
        allPreviousNewLoginOtp.forEach(previousOtp => {
            previousOtp.status = 'DENIED'
            previousOtp.save()
        })
        let newLoginOtp = await new UserOtpModel({
            userId: company._id,
            otp: crypto.randomInt(100000, 999999),
            userType: 'COMPANY',
            operationType: 'LOGIN',
            status: 'NEW'
        }).save();

        sendEmail(company.email, 'Login OTP', `Your login OTP is: ${newLoginOtp.otp}`, false)

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
            userType: 'COMPANY',
            status: 'NEW'
        })
        if (!userOtp) {
            return res.status(403)
                .json({message: "Invalid OTP", success: false})
        }
        userOtp.status = 'USED'
        await userOtp.save()

        const company = await CompanyModel.findById(userOtp.userId);
        const jwtToken = jwt.sign(
            {
                companyName: company.companyName,
                email: company.email,
                companyID: company.companyID,
                role: company.role,
                _id: company._id,
            }, // يحتوي على المعلومات التي تريد تضمينها
            process.env.JWT_SECRET, // هو مفتاح سري يستخدم لتوقيع الرمز
            {expiresIn: '24h'} // optional ---> الرمز سينتهي بعد 24 ساعه من انشائه
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                role: company.role
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
        const companyId = jwt.decode(req.headers.authorization)._id
        const company = await CompanyModel.findOne({companyID: companyId});
        if (!company) {
            return res.status(403)
                .json({message: "Unauthorized Operation", success: false})
        }
        const allPreviousNewOtp = await UserOtpModel.find({
            userId: company._id,
            userType: 'COMPANY',
            operationType: 'ENABLE_2FA',
            status: 'NEW'
        })
        allPreviousNewOtp.forEach(previousOtp => {
            previousOtp.status = 'DENIED'
            previousOtp.save()
        })

        let newOtp = await new UserOtpModel({
            userId: company._id,
            otp: crypto.randomInt(100000, 999999),
            userType: 'COMPANY',
            operationType: 'ENABLE_2FA',
            status: 'NEW'
        }).save();

        sendEmail(company.email, 'Enable OTP', `Your enabling OTP is: ${newOtp.otp}`, false)

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
        const companyId = jwt.decode(req.headers.authorization)._id
        const company = await CompanyModel.findOne({companyID: companyId});
        if (!company) {
            return res.status(403)
                .json({message: "Unauthorized Operation", success: false})
        }
        const userOtp = await UserOtpModel.findOne({
            userId: company._id,
            otp: otp,
            userType: 'COMPANY',
            operationType: 'ENABLE_2FA',
            status: 'NEW'
        })
        if (!userOtp) {
            return res.status(403)
                .json({message: "Invalid OTP", success: false})
        }
        userOtp.status = 'USED'
        await userOtp.save()

        company.otpEnabled = true
        await company.save()

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
        const companyId = jwt.decode(req.headers.authorization)._id
        const company = await CompanyModel.findOne({companyID: companyId});
        if (!company) {
            return res.status(403)
                .json({message: "Unauthorized Operation", success: false})
        }
        const allPreviousNewOtp = await UserOtpModel.find({
            userId: company._id,
            userType: 'COMPANY',
            operationType: 'DISABLE_2FA',
            status: 'NEW'
        })
        allPreviousNewOtp.forEach(previousOtp => {
            previousOtp.status = 'DENIED'
            previousOtp.save()
        })

        let newOtp = await new UserOtpModel({
            userId: company._id,
            otp: crypto.randomInt(100000, 999999),
            userType: 'COMPANY',
            operationType: 'DISABLE_2FA',
            status: 'NEW'
        }).save();

        sendEmail(company.email, 'Disable OTP', `Your disabling OTP is: ${newOtp.otp}`, false)

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
        const companyId = jwt.decode(req.headers.authorization)._id
        const company = await CompanyModel.findOne({companyID: companyId});
        if (!company) {
            return res.status(403)
                .json({message: "Unauthorized Operation", success: false})
        }
        const userOtp = await UserOtpModel.findOne({
            userId: company._id,
            otp: otp,
            userType: 'COMPANY',
            operationType: 'DISABLE_2FA',
            status: 'NEW'
        })
        if (!userOtp) {
            return res.status(403)
                .json({message: "Invalid OTP", success: false})
        }
        userOtp.status = 'USED'
        await userOtp.save()

        company.otpEnabled = false
        await company.save()

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