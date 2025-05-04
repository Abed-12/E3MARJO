import bodyParser from "body-parser";
import {login, registration} from "../Controllers/CompanyController.js";
import {loginValidation, registrationValidation, updateValidation} from "../Middlewares/CompanyValidation.js";
import CompanyModel from "../Models/Company.js"
import ensureAuthenticated from "../Middlewares/Auth.js"
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {cementOrder} from "../Controllers/OrderController.js";
import SupplierModel from "../Models/Supplier.js";
import OrderModel from "../Models/Order.js";
import AdminModel from "../Models/Admin.js";
import {formidableTransformer} from "../Middlewares/FormidableTransformer.js";

const app = express();
app.use(bodyParser.json());
const CompanyRouter = express.Router();

// Login & Registration
CompanyRouter.post('/login', loginValidation, login);
CompanyRouter.post('/registration', formidableTransformer, registrationValidation, registration);

// ----------------------------- admin -----------------------------
// fetch company data
CompanyRouter.get('/companyData', ensureAuthenticated, async (req, res) => {
    try {
        const companies = await CompanyModel.find(
            {status:"Active"},
                {  
                    _id:1,
                    companyName: 1,
                    email: 1,
                    companyID: 1,
                    companyPhone: 1,
                    commercialRegister: 1,
                    role: 1,
                    adminID: 1
                }
        ); 
        if (companies.length === 0){  return res.json({ error: "No data found" });        }

        const companyWithAdmin = await Promise.all(companies.map(async (data)=>{

            const admin = await AdminModel.findOne(
                { _id: data.adminID },
                { adminName: 1, }
            );
            return{
                _id:data._id,
                companyName:data.companyName,
                email:data.email,
                companyID:data.companyID,
                companyPhone:data.companyPhone,
                commercialRegister:data.commercialRegister,
                role:data.role,
                adminName: admin ? admin.adminName : null,
            
            }
        }))
        res.json(companyWithAdmin)


    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
}); 

// fetch company data by id
CompanyRouter.get('/companyData/:id', ensureAuthenticated, async (req, res) => {
    const companyID = req.params.id;

    try {
        const data = await CompanyModel.findOne(
            { _id: companyID, status: "Active" },
            {
                _id: 1,
                companyName: 1,
                email: 1,
                companyID: 1,
                companyPhone: 1,
                commercialRegister: 1,
                adminID: 1,
            }
        );

        if (!data) {
            return res.status(404).json({ error: "Company not found" });
        }

        const admin = await AdminModel.findById(data.adminID, { adminName: 1 });

        const companyWithAdmin = {
            _id: data._id,
            companyName: data.companyName,
            email: data.email,
            companyID: data.companyID,
            companyPhone: data.companyPhone,
            commercialRegister: data.commercialRegister,
            adminName: admin ? admin.adminName : null,
        };

        res.json(companyWithAdmin);

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch company data" });
    }
});


// delete company from collection 
CompanyRouter.delete("/delete/:id", ensureAuthenticated, async (req, res) => {
    try 
        {
            const adminId  = jwt.decode(req.headers.authorization)._id; // extract the id of admin who is accept the request
            const companyId = (req.params.id); 
            const mongoID = await CompanyModel.findOne({companyID: companyId}, '_id').lean();                
            await OrderModel.updateMany(
                {companyID:mongoID._id},
                { 
                    $set: {
                        status: "rejected",
                        rejectionReason: "The company has been deleted"
                    }
                }            
            )
            await CompanyModel.updateOne({companyID:companyId},
                {
                    $set:{
                            status: "inactive",
                            adminID:adminId
                        }
                }    
            );
            res.status(200).json({ message: "company  deleted successfully" });
        }
            catch (error) 
        {
                res.status(500).json({ error: "Failed to delete company" });
        }
});

CompanyRouter.get('/admin-commercial-register/:id', ensureAuthenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const company = await CompanyModel.findOne({companyID: id})
        if (!company) return res.status(404).json({message: 'Commercial register not found', success: false});
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'Content-Disposition',
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${company.companyName}.pdf"`,
            }).send(company.commercialRegister) 
        } catch (error) {
        res.status(500).json({ message: "Internal server errror: " + error.message, success: false });
    }
});

// ----------------------------- Concrete -----------------------------


// ----------------------------- Cement -----------------------------
// cement order
CompanyRouter.post('/cement-order', ensureAuthenticated, cementOrder);

// Get commercialRegister Data in Collection Companies 
CompanyRouter.get('/company-commercial-register', ensureAuthenticated, async (req, res) => {
    try {
        const id = jwt.decode(req.headers.authorization)._id;
        const company = await CompanyModel.findOne({_id: id})
        if (!company) return res.status(404).json({message: 'Commercial register not found', success: false});
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'Content-Disposition',
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${company.companyName}.pdf`,
        }).send(company.commercialRegister)
    } catch (error) {
        res.status(500).json({message: "Internal server errror: " + error.message, success: false});
    }
});

// Get Price in Collection Supplier 
CompanyRouter.get('/data-supplier', ensureAuthenticated, async (req, res) => {
    try {
        const supplierProducts = req.query.supplierProducts.split(',');

        const query = {status:"Active"};
        if (supplierProducts) {
            query.supplierProduct = supplierProducts
        }

        const dataSupplier = await SupplierModel.find(query);
        if (!dataSupplier) return res.status(404).json({message: 'Supplier not found', success: false});
        res.json(dataSupplier.map(item => {
            if(supplierProducts == 'cement'){
                return {
                    supplierName: item.supplierName,
                    price: item.price,
                }
            } else if (supplierProducts == 'concrete'){
                return {
                    supplierName: item.supplierName,
                    concreteStrength: item.concreteStrength,
                }
            }
            else{
                return {
                    supplierID: item._id,
                    supplierName: item.supplierName,
                    type: item.supplierProduct
                }
            }
        }));
    } catch (error) {
        res.status(500).json({message: "Internal server errror: " + error.message, success: false});
    }
});

// Get Data in Collection Supplier 
CompanyRouter.get('/company-data', ensureAuthenticated, async (req, res) => {
    try {
        const id = jwt.decode(req.headers.authorization)._id;
        const companyData = await CompanyModel.findOne({_id: id})
        if (!companyData) return res.status(404).json({message: 'Company not found', success: false});
        res.json({
            companyPhone: companyData.companyPhone,
            otpEnabled: companyData.otpEnabled,
        });
    } catch (error) {
        res.status(500).json({message: "Internal server errror: " + error.message, success: false});
    }
});

// Define a route to handle PATCH requests for updating a cement order
CompanyRouter.patch('/update-order-status', ensureAuthenticated, async (req, res) => {
    try {
        const {id} = req.body;
        const {status} = req.body;
        const updateCementOrder = await OrderModel.findByIdAndUpdate(id, {status: status});
        if (!updateCementOrder) {
            return res.status(404).json({message: "Order not found", success: false});
        }
        res.status(200).json({message: "", success: true});
    } catch (error) {
        res.status(500).json({message: "Internal server errror: " + error.message, success: false});
    }
});

// Delete order in pending
CompanyRouter.delete('/order-delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const deleteOrder = await OrderModel.deleteOne({_id: id});
        if (!deleteOrder) {
            return res.status(404).json({message: "Order not found", success: false});
        }
        res.status(200).json({message: "", success: true});
    } catch (error) {
        res.status(500).json({message: "Internal server errror: " + error.message, success: false});
    }
});

// Get All Data in Collection Order
CompanyRouter.get('/order-data', ensureAuthenticated, async (req, res) => {
    try {
        const statuses = req.query.statuses.split(',');
        const type = req.query?.type?.split(',');
        const supplierID = req.query?.supplierID?.split(',');
        const fromDate = req.query.fromDate;
        const toDate = req.query.toDate;
        const id = jwt.decode(req.headers.authorization)._id;

        var query = {companyID: id, status: statuses}

        if (type) {
            query.type = type
        }
        if (supplierID) {
            query.supplierID = supplierID
        }
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
        const supplierIDs = dataOrders.map(item => item.supplierID);
        const dataSupplier = await SupplierModel.find({_id: {$in: supplierIDs}});
        const dataCompany = await CompanyModel.findById(id);

        // تحويل البيانات حسب الحاجة
        const result = dataOrders.map(item => {
            const supplier = dataSupplier.find(s => s._id.toString() === item.supplierID.toString());
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
                    supplierName: supplier.supplierName,
                    supplierPhone: supplier.supplierPhone,
                    companyName: dataCompany.companyName,
                    companyPhone: dataCompany.companyPhone
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
                    supplierName: supplier.supplierName,
                    supplierPhone: supplier.supplierPhone,
                    companyName: dataCompany.companyName,
                    companyPhone: dataCompany.companyPhone
                };
            }
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({message: "Internal server errror: " + error.message, success: false});
    }
});

// Get order data by ID
CompanyRouter.get('/order-data/:id', ensureAuthenticated, async (req, res) => {
    try {
        const orderID = req.params.id; // نأخذ id من الرابط
        if (!orderID) {
            return res.status(400).json({ message: "Order ID is required", success: false });
        }

        const companyID = jwt.decode(req.headers.authorization)._id; // استخراج companyID من التوكن

        const order = await OrderModel.findOne({ _id: orderID, companyID: companyID });
        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false });
        }

        const supplier = await SupplierModel.findById(order.supplierID);
        const company = await CompanyModel.findById(companyID);

        let result;
        if (order.type === 'cement') {
            result = {
                id: order._id,
                type: order.type,
                recipientName: order.recipientName,
                recipientPhone: order.recipientPhone,
                location: order.location,
                deliveryTime: order.deliveryTime,
                orderRequestTime: order.orderRequestTime,
                status: order.status,
                price: order.price,
                rejectionReason: order.rejectionReason,
                cementQuantity: order.cementQuantity,
                cementNumberBags: order.cementNumberBags,
                supplierName: supplier?.supplierName,
                supplierPhone: supplier?.supplierPhone,
                companyName: company?.companyName,
                companyPhone: company?.companyPhone
            };
        } else if (order.type === 'concrete') {
            result = {
                id: order._id,
                type: order.type,
                recipientName: order.recipientName,
                recipientPhone: order.recipientPhone,
                location: order.location,
                deliveryTime: order.deliveryTime,
                orderRequestTime: order.orderRequestTime,
                status: order.status,
                price: order.price,
                rejectionReason: order.rejectionReason,
                concreteQuantity: order.concreteQuantity,
                concreteStrength: order.concreteStrength,
                concreteNote: order.concreteNote,
                supplierName: supplier?.supplierName,
                supplierPhone: supplier?.supplierPhone,
                companyName: company?.companyName,
                companyPhone: company?.companyPhone
            };
        }

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message, success: false });
    }
});


// Define a route to handle PATCH requests for updating a profile
CompanyRouter.patch('/update-profile', updateValidation, ensureAuthenticated, async (req, res) => {
    try {
        const id = jwt.decode(req.headers.authorization)._id;
        const { companyPhone, password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const query = {};
        if (companyPhone) query.companyPhone = companyPhone;
        if (password) query.password = hashPassword;

        if (Object.keys(query).length === 0) {
            return res.json({message: "No valid data provided to update. Allowed fields are: companyPhone, and password"});
        }

        const updateCompany = await CompanyModel.findByIdAndUpdate(id, query);

        if (!updateCompany) {
            return res.status(404).json({message: "Order not found", success: false});
        }
        res.status(200).json({message: "Profile has been updated", success: true});
    } catch (error) {
        res.status(500).json({message: "Internal server errror: " + error, success: false});
    }
});

export default CompanyRouter;