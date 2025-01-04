import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {login, registration} from "../Controllers/SupplierController.js";
import {loginValidation, registrationValidation, updateValidation} from "../Middlewares/SupplierValidation.js";
import ensureAuthenticated from "../Middlewares/Auth.js";
import OrderModel from "../Models/Order.js";
import SupplierModel from "../Models/Supplier.js";
import CompanyModel from "../Models/Company.js";
import AdminModel from "../Models/Admin.js";
import {formidableTransformer} from "../Middlewares/FormidableTransformer.js";
import {concreteOrder} from "../Controllers/OrderController.js";


const SupplierRouter = express.Router();

// Login & Registration
SupplierRouter.post('/login', loginValidation, login);
SupplierRouter.post('/registration', formidableTransformer, registrationValidation, registration);

// ----------------------------- admin -----------------------------
// fetch supplier data
SupplierRouter.get('/supplierData', ensureAuthenticated, async (req, res) => {
    try 
    {
        const suppliers = await SupplierModel.find({},
            {
                _id: 1,
                supplierName:1,
                email: 1,
                supplierID:1,
                supplierPhone:1,
                supplierProduct:1,
                price:1,
                concreteStrength:1,
                commercialRegister: 1,
                adminID: 1,
            });
        if(suppliers.length===0){
            return res.json({ error: "No data found" });
        }

        const suppliersWithAdmin = await Promise.all(suppliers.map(async (data) => {
            // Find admin email using adminID
            const admin = await AdminModel.findById(data.adminID);
            return {
                _id: data._id,
                supplierName: data.supplierName,
                email: data.email,
                supplierID: data.supplierID,
                supplierPhone: data.supplierPhone,
                price: data.price,
                concreteStrength: data.concreteStrength,
                commercialRegister: data.commercialRegister,
                supplierProduct: data.supplierProduct,
                adminName: admin ? admin.adminName : null,
            };
        }));
        res.json(suppliersWithAdmin);
    } catch (error)
    {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// delete supplier from collection 
SupplierRouter.delete("/delete/:id", ensureAuthenticated, async (req, res) => {
    try 
        {
            const supplierId = (req.params.id); 
            await SupplierModel.deleteOne({ supplierID: supplierId });
            res.status(200).json({ message: "supplier  deleted successfully" });
        }
            catch (error) 
        {
                res.status(500).json({ error: "Failed to delete supplier" });
        }
});

SupplierRouter.get('/admin-commercial-register/:id', ensureAuthenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const supplier = await SupplierModel.findOne({supplierID : id})
        if (!supplier) return res.status(404).json({message: 'Commercial register not found', success: false});   
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'Content-Disposition',
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment;filename=${supplier.supplierName}.pdf`,
            }).send(supplier.commercialRegister) 
        } catch (error) {
        res.status(500).json({ message: "Internal server errror: " + error.message, success: false });
    }
});

// ----------------------------- Concrete -----------------------------


// ----------------------------- Cement -----------------------------

SupplierRouter.get('/supplier-commercial-register', ensureAuthenticated, async (req, res) => {
    try {
        const id = jwt.decode(req.headers.authorization)._id;
        const supplier = await SupplierModel.findOne({_id: id})
        if (!supplier) return res.status(404).json({message: 'Commercial register not found', success: false});
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'Content-Disposition',
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${supplier.supplierName}.pdf`,
        }).send(supplier.commercialRegister)
    } catch (error) {
        return res.status(500).json({message: "Internal server errror: " + error.message, success: false});
    }
});


// Define a route to handle PATCH requests for updating a cement order
SupplierRouter.patch('/update-order-status', ensureAuthenticated, async (req, res) => {
    try {
        const {id, status, rejectReason} = req.body;
        const updateCementOrder = await OrderModel.findByIdAndUpdate(id, {
            status: status,
            rejectionReason: rejectReason
        });
        if (!updateCementOrder) {
            return res.status(404).json({message: "Order not found", success: false});
        }
        res.status(200).json({message: "", success: true});
    } catch (error) {
        res.status(500).json({message: "Internal server errror: " + error.message, success: false});
    }
});

// Get Data in Collection Supplier 
SupplierRouter.get('/supplier-data', ensureAuthenticated, async (req, res) => {
    try {
        const id = jwt.decode(req.headers.authorization)._id;
        const supplierData = await SupplierModel.findOne({_id: id})
        if (!supplierData) return res.status(404).json({message: 'Supplier not found', success: false});
        res.json({
            price: supplierData.price,
            supplierPhone: supplierData.supplierPhone,
            concreteStrength: supplierData.concreteStrength,
            otpEnabled: supplierData.otpEnabled,
        });
    } catch (error) {
        res.status(500).json({message: "Internal server errror: " + error.message, success: false});
    }
});

// Get All Data in Collection Order
SupplierRouter.get('/order-data', ensureAuthenticated, async (req, res) => {
    try {
        const statuses = req.query.statuses.split(',');
        const fromDate = req.query.fromDate;
        const toDate = req.query.toDate;
        const id = jwt.decode(req.headers.authorization)._id;

        var query = {supplierID: id, status: statuses}

        // إضافة فلتر التاريخ
        if (fromDate || toDate) {
            query.deliveryTime = {};
            if (fromDate) {
                query.deliveryTime.$gte = fromDate;
            }
            if (toDate) {
                query.deliveryTime.$lte = toDate;
            }
        }

        const dataOrders = await OrderModel.find(query).sort({orderRequestTime: -1});
        if (!dataOrders || dataOrders.length === 0) return res.json([]);

        // جلب بيانات المورد والشركة من قاعدة البيانات
        const companyIDs = dataOrders.map(item => item.companyID);
        const dataSupplier = await SupplierModel.findById(id);
        const dataCompanies = await CompanyModel.find({_id: {$in: companyIDs}});

        // تحويل البيانات حسب الحاجة
        const result = dataOrders.map(item => {
            const company = dataCompanies.find(c => c._id.toString() === item.companyID.toString());
            if (item.type == 'cement') {
                return {
                    id: item._id,
                    type: item.type,
                    recipientName: item.recipientName,
                    recipientPhone: item.recipientPhone,
                    location: item.location,
                    deliveryTime: item.deliveryTime,
                    orderRequestTime: item.orderRequestTime,
                    status: item.status,
                    price: item.price,
                    rejectionReason: item.rejectionReason,
                    cementQuantity: item.cementQuantity,
                    cementNumberBags: item.cementNumberBags,
                    supplierName: dataSupplier.supplierName,
                    companyName: company.companyName,
                    companyPhone: company.companyPhone
                };
            } else if (item.type == 'concrete') {
                return {
                    id: item._id,
                    type: item.type,
                    recipientName: item.recipientName,
                    recipientPhone: item.recipientPhone,
                    location: item.location,
                    deliveryTime: item.deliveryTime,
                    orderRequestTime: item.orderRequestTime,
                    status: item.status,
                    price: item.price,
                    rejectionReason: item.rejectionReason,
                    concreteQuantity: item.concreteQuantity,
                    concreteStrength: item.concreteStrength,
                    concreteNote: item.concreteNote,
                    supplierName: dataSupplier.supplierName,
                    companyName: company.companyName,
                    companyPhone: company.companyPhone
                };
            }
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({message: "Internal server errror: " + error.message, success: false});
    }
});

// Define a route to handle PATCH requests for updating a profile
SupplierRouter.patch('/update-profile', updateValidation, ensureAuthenticated, async (req, res) => {
    try {
        const id = jwt.decode(req.headers.authorization)._id;
        const {price, supplierPhone, password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const query = {};
        if (price) query.price = price;
        if (supplierPhone) query.supplierPhone = supplierPhone;
        if (password) query.password = hashPassword;

        if (Object.keys(query).length === 0) {
            return res.json({message: "No valid data provided to update. Allowed fields are: price, supplierPhone, and password"});
        }

        const updateSupplier = await SupplierModel.findByIdAndUpdate(id, query);

        if (!updateSupplier) {
            return res.status(404).json({message: "Order not found", success: false});
        }
        res.status(200).json({message: "Profile has been updated", success: true});
    } catch (error) {
        res.status(500).json({message: "Internal server errror: " + error, success: false});
    }
});

// PUT route to update concreteStrength
SupplierRouter.put('/update-concrete-strength', ensureAuthenticated, async (req, res) => {
    try {
        const id = jwt.decode(req.headers.authorization)._id;
        const { concreteStrength } = req.body;
        console.log(concreteStrength)

        if (!concreteStrength) {
            return res.status(400).json({ success: false, message: 'Concrete strength is required' });
        }

        // Find the supplier and update their concreteStrength
        const updatedSupplier = await SupplierModel.findByIdAndUpdate( id, { concreteStrength });

        if (!updatedSupplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }

        return res.status(200).json({ success: true, message: 'Concrete strength updated successfully', data: updatedSupplier });
    } catch (error) {
        res.status(500).json({message: "Internal server errror: " + error, success: false});
    }
});

// ----------------------------- Concrete -----------------------------

SupplierRouter.post('/concrete-order', ensureAuthenticated, concreteOrder);


export default SupplierRouter;