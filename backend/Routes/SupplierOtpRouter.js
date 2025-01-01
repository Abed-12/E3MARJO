import express from "express";
import {
    disableOtp,
    disableOtpConfirm,
    enableOtp,
    enableOtpConfirm,
    loginOtp
} from "../Controllers/SupplierController.js";
import {disableOtpValidation, enableOtpValidation, loginOtpValidation} from "../Middlewares/SupplierValidation.js";
import bodyParser from "body-parser";
import ensureAuthenticated from "../Middlewares/Auth.js";

const app = express();
app.use(bodyParser.json());

const SupplierOtpRouter = express.Router();

SupplierOtpRouter.post('/login/otp', loginOtpValidation, loginOtp);

SupplierOtpRouter.post('/otp/enable', ensureAuthenticated, enableOtp);
SupplierOtpRouter.post('/otp/enable/confirm', ensureAuthenticated, enableOtpValidation, enableOtpConfirm);

SupplierOtpRouter.post('/otp/disable', ensureAuthenticated, disableOtp);
SupplierOtpRouter.post('/otp/disable/confirm', ensureAuthenticated, disableOtpValidation, disableOtpConfirm);

export default SupplierOtpRouter;