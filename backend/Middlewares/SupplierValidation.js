import Joi from "joi";
import fs from "node:fs";

const registrationValidation = (req, res, next) => {
    const dataSchema = Joi.object({
        supplierName: Joi.string().required(),
        email: Joi.string().email().required(),
        supplierID: Joi.string().length(9).required(),
        password: Joi.string().min(9).max(18).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/).required().messages(
            {'string.min': 'Password must be at least 9 characters long.',
            'string.max': 'Password cannot exceed 18 characters.',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            'any.required': 'Password is required.',}),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages(
            {'any.only': 'Passwords do not match'}),
        supplierPhone: Joi.string().length(10).required(),
        supplierProduct: Joi.string().required()
    });
    const fileSchema = Joi.array()
        .items(
            Joi.binary()
                .max(5 * 1024 * 1024)
                .required()
                .messages({
                    'any.required': 'Commercial Register is required',
                    'binary.max': 'File size must not exceed 5 MB', 
                })
        )
        .min(1)
        .max(1)
        .required()
        .messages({
            'array.min': 'At least one file must be uploaded',
            'any.required': 'Files are required',
            'array.max': 'At most one file can be uploaded',            
        });
    const {error: dataError} = dataSchema.validate(JSON.parse(req.fields.body[0]));
    let files = req.files.commercialRegister.map(file => fs.readFileSync(file.filepath));
    const {error: fileError} = fileSchema.validate(files);
    if (dataError || fileError) {
        return res.status(400)
            .json({message: `Bad request: ${dataError ?? '' + fileError ?? ''}`})
    }
    next();
}

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        supplierID: Joi.string().required(),
        password: Joi.string().required()
    });
    next();
}

const loginOtpValidation = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        otp: Joi.string().required()
    });
    schema.validate(req.body)
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
        .json({ message: "Bad request", error })
    }
    next();
}

const enableOtpValidation = (req, res, next) => {
    const schema = Joi.object({
        otp: Joi.string().required()
    });
    schema.validate(req.body)
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
        .json({ message: "Bad request", error })
    }
    next();
}

const disableOtpValidation = (req, res, next) => {
    const schema = Joi.object({
        otp: Joi.string().required()
    });
    schema.validate(req.body)
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
        .json({ message: "Bad request", error })
    }
    next();
}

const updateValidation = (req, res, next) => {
    const schema = Joi.object({
        password: Joi.string().min(9).max(18).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/).allow('').messages(
            {'string.min': 'Password must be at least 9 characters long.',
            'string.max': 'Password cannot exceed 18 characters.',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            'any.required': 'Password is required.',}),
        confirmPassword: Joi.string().valid(Joi.ref('password')).messages(
            {'any.only': 'Passwords do not match'}),
        supplierPhone: Joi.string().length(10).allow(''),
        price: Joi.number().allow(''),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
        .json({ message: "Bad request", error })
    }
    next();
}



export { registrationValidation, loginValidation, loginOtpValidation, enableOtpValidation, disableOtpValidation, updateValidation };