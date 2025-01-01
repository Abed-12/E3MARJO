import express from "express";
import {loginOtp} from "../Controllers/SupplierController.js";
import {loginOtpValidation} from "../Middlewares/SupplierValidation.js";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const SupplierOtpRouter = express.Router();

SupplierOtpRouter.post('/login/otp', loginOtpValidation, loginOtp);

export default SupplierOtpRouter;