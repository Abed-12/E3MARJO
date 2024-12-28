import express from "express";
import { login, register } from "../Controllers/AdminController.js"; 
import { loginValidation } from "../Middlewares/AdminValidation.js";


const AdminRouter = express.Router();

// Login route
AdminRouter.post('/admin', login);

// Add admin route
AdminRouter.post('/add-admin', loginValidation, register);

export default AdminRouter;
