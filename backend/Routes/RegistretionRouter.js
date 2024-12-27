
import express from "express";
import bodyParser from "body-parser";
import CompanyModel from "../Models/Company.js";     
import SupplierModel from "../Models/Supplier.js";
import RegisterModel from "../Models/UserRegistration.js"
import AdminModel from '../Models/Admin.js'
import ensureAuthenticated from "../Middlewares/Auth.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const SupplierRouter = express.Router();
const CompanyRouter = express.Router();
const RegistrationRouter = express.Router();

const app = express();
app.use(bodyParser.json()); 



// ----------------------------- Admin -----------------------------

// fetch register company/supplier data ( new , rejected) 
RegistrationRouter.get('/fetchRegistrationData', ensureAuthenticated, async (req, res) => {
    try {
        const status = req.query.status; // save the query  new or rejected 
        if (status != "rejected" && status != "new"  ) 
        {
            return res.status(404).json({ error: "wrong status" });
        }
        const registration  = await RegisterModel.find({status : status});  // fetch data that match the status
        if (registration.length === 0)
        {
            return res.json([]);
        } 
        const adminId  = jwt.decode(req.headers.authorization)._id; // extract the id of admin who is accept the request
        const { email: adminEmail } = await AdminModel.findById(adminId);
        res.json
        (
            registration.map(data =>
                {
                    if (data.role === "supplier")
                        {
                            return {
                                _id:data._id, // return the id bc in for loop use for key " or i can use index 0 , 1, 2, etc"
                                name:data.name,
                                email:data.email,
                                ID:data.ID,
                                phone:data.phone,
                                role:data.role,
                                commercialRegister:data.commercialRegister,
                                supplierProduct:data.supplierProduct,
                                adminEmail
                            };
                        }
                        
                        else if (data.role === "company") 
                        { 
                            return {
                            _id:data._id, // return the id bc in for loop use for key " or i can use index 0 , 1, 2, etc"
                            name:data.name,
                            email:data.email,
                            ID:data.ID,
                            phone:data.phone,
                            role:data.role,
                            commercialRegister:data.commercialRegister,
                            adminEmail
                            };
                        }

                })

                
        );
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

RegistrationRouter.patch("/approve/:id", ensureAuthenticated,  async (req, res) => {
    try 
        {
            const userId = req.params.id; // get the id of the Registration
            const registrationUser = await RegisterModel.findOne({ID:userId}); // find the user by id

            const adminId  = jwt.decode(req.headers.authorization)._id; // extract the id of admin who is accept the request
            if ( registrationUser.role =="company")
            {
                const newCompany = new CompanyModel(
                {
                    companyName:registrationUser.name,
                    email:registrationUser.email,
                    companyID:registrationUser.ID,
                    password:registrationUser.password,
                    companyPhone:registrationUser.phone,
                    commercialRegister:registrationUser.commercialRegister,
                    role:registrationUser.role,
                    adminID: adminId , // Set the adminName field
                });
                newCompany.save();
            }
            else 
            {
                const newSupplier = new SupplierModel(
                {
                    supplierName:registrationUser.name,
                    email:registrationUser.email,
                    supplierID:registrationUser.ID,
                    password:registrationUser.password,
                    supplierPhone:registrationUser.phone,
                    supplierProduct:registrationUser.supplierProduct,
                    commercialRegister:registrationUser.commercialRegister,
                    role:registrationUser.role,
                    adminID: adminId, // Set the adminName field
                });
                newSupplier.save();
            }
            const idForDelete = registrationUser._id.toString();
            await RegisterModel.deleteOne({_id:idForDelete});
            res.status(200).json({ message: ` approve successfully` });
        }
        catch (error) 
        {
            res.status(500).json({ error: `Failed to  approve ` });
        }
});

// reject request 
RegistrationRouter.patch("/rejected/:id", ensureAuthenticated, async (req, res) => {
    try 
        {   
            const UserId = req.params.id; 
            const adminId  = jwt.decode(req.headers.authorization)._id; // extract the id of admin who is accept the request
            await RegisterModel.updateOne
            (
                { ID: UserId },
                {$set:
                {
                    status: "rejected",
                    adminID: adminId, 
                }}
            )
        res.status(200).json({ message: `user rejected successfully` });
        }
            catch (error) 
        {
                res.status(500).json({ error: `Failed to  reject user` });
        }
});

RegistrationRouter.delete("/delete/:id", ensureAuthenticated, async (req, res) => {
    try 
        {
            const userId = (req.params.id); 
            await RegisterModel.deleteOne({ ID: userId });
            res.status(200).json({ message: "user  deleted successfully" });
        }
            catch (error) 
        {
                res.status(500).json({ error: "Failed to delete user" });
        }
});

export default RegistrationRouter;