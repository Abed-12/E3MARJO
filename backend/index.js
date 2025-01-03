import express from "express";
import env from "dotenv";
import bodyParser from "body-parser";
import AdminRouter from "./Routes/AdminRouter.js";
import SupplierRouter from "./Routes/SupplierRouter.js";
import CompanyRouter from "./Routes/CompanyRouter.js";
import RegistrationRouter from './Routes/RegistretionRouter.js';
import cors from "cors";

import './Models/db.js';
import CompanyOtpRouter from "./Routes/CompanyOtpRouter.js";
import SupplierOtpRouter from "./Routes/SupplierOtpRouter.js";

const app = express();
env.config();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT;

app.use("/auth", AdminRouter);
app.use("/auth/register", RegistrationRouter);
app.use("/auth/supplier", SupplierRouter);
app.use("/auth/company", CompanyRouter);
app.use("/auth/supplier", SupplierOtpRouter);
app.use("/auth/company", CompanyOtpRouter);


app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});