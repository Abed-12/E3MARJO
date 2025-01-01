import bodyParser from "body-parser";
import {loginOtp} from "../Controllers/CompanyController.js";
import {loginOtpValidation} from "../Middlewares/CompanyValidation.js";
import express from "express";

const app = express();
app.use(bodyParser.json());
const CompanyOtpRouter = express.Router();

CompanyOtpRouter.post('/login/otp', loginOtpValidation, loginOtp);


export default CompanyOtpRouter;