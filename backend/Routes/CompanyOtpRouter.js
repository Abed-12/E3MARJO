import bodyParser from "body-parser";
import {
    disableOtp,
    disableOtpConfirm,
    enableOtp,
    enableOtpConfirm,
    loginOtp
} from "../Controllers/CompanyController.js";
import {disableOtpValidation, enableOtpValidation, loginOtpValidation} from "../Middlewares/CompanyValidation.js";
import express from "express";
import ensureAuthenticated from "../Middlewares/Auth.js";

const app = express();
app.use(bodyParser.json());

const CompanyOtpRouter = express.Router();

CompanyOtpRouter.post('/login/otp', loginOtpValidation, loginOtp);

CompanyOtpRouter.post('/otp/enable', ensureAuthenticated, enableOtp);
CompanyOtpRouter.post('/otp/enable/confirm', ensureAuthenticated, enableOtpValidation, enableOtpConfirm);

CompanyOtpRouter.post('/otp/disable', ensureAuthenticated, disableOtp);
CompanyOtpRouter.post('/otp/disable/confirm', ensureAuthenticated, disableOtpValidation, disableOtpConfirm);


export default CompanyOtpRouter;