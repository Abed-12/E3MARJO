import bodyParser from "body-parser";
import {login, registration} from "../Controllers/CompanyController.js";
import {loginValidation, registrationValidation} from "../Middlewares/CompanyValidation.js";
import CompanyModel from "../Models/Company.js"
import ensureAuthenticated from "../Middlewares/Auth.js"
import express from "express";
import jwt from "jsonwebtoken";
import cementOrder from "../Controllers/OrderController.js";
import SupplierModel from "../Models/Supplier.js";
import OrderModel from "../Models/Order.js";
import {formidableTransformer} from "../Middlewares/FormidableTransformer.js";

const app = express();
app.use(bodyParser.json());
const CompanyRouter = express.Router();

// Login & Registration
CompanyRouter.post('/login', loginValidation, login);
CompanyRouter.post('/registration', formidableTransformer, registrationValidation, registration);

// --------------------------------Admin--------------------------------
// fetch company data
CompanyRouter.get('/companyData', ensureAuthenticated, async (req, res) => {
    try {
        const companies = await CompanyModel.find({},
            {
                _id: 1,
                companyName: 1,
                email: 1,
                companyID: 1,
                companyPhone: 1,
                commercialRegister: 1,
                adminId: 1
            });

        if (companies.length === 0) {
            return res.json({error: "No data found"});
        }
        res.json(companies);

    } catch (error) {
        res.status(500).json({error: "Failed to fetch data"});
    }
});

// delete company from collection 
CompanyRouter.delete("/delete/:id", ensureAuthenticated, async (req, res) => {
    try {
        const companyID = (req.params.id);
        await CompanyModel.deleteOne({companyID: companyID});
        res.status(200).json({message: "company  deleted successfully"});
    } catch (error) {
        res.status(500).json({error: "Failed to delete company"});
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
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${company.companyName}.pdf`,
        }).send(company.commercialRegister)
    } catch (error) {
        return res.status(500).json({message: "Internal server errror: " + error.message, success: false});
    }
});

// Get Price in Collection Supplier - in CementOrder
CompanyRouter.get('/data-supplier', ensureAuthenticated, async (req, res) => {
    try {
        const supplierProducts = req.query.supplierProducts.split(',');

        const query = {};
        if (supplierProducts) {
            query.supplierProduct = supplierProducts
        }

        const dataSupplier = await SupplierModel.find(query);
        if (!dataSupplier) return res.status(404).json({message: 'Supplier not found', success: false});
        res.json(dataSupplier.map(item => {
            return {
                supplierID: item._id,
                supplierName: item.supplierName,
                price: item.price,
                type: item.supplierProduct
            }
        }));
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
        const type = req.query.type;
        const supplierID = req.query.supplierID;
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
        ;

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
                    // field cocrete

                    supplierName: supplier.supplierName,
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


// ----------------------------- Concrete -----------------------------


export default CompanyRouter;