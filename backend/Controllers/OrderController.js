import OrderModel from '../Models/Order.js';
import SupplierModel from '../Models/Supplier.js';
import jwt from "jsonwebtoken";

const cementOrder = async (req, res) => {
    try{
        const {type, recipientName, recipientPhone, location, deliveryTime, orderRequestTime, cementQuantity, cementNumberBags, price, supplierName, supplierID, companyID} = req.body;
        const cementOrderModel = new OrderModel({type, recipientName, recipientPhone, location, deliveryTime, orderRequestTime, cementQuantity, cementNumberBags, price, supplierID, companyID})
        const supplier = await SupplierModel.findOne({supplierName});
        // get the user id from the token
        cementOrderModel.companyID = jwt.decode(req.headers.authorization)._id;
        cementOrderModel.supplierID = supplier._id;
        await cementOrderModel.save();
        res.status(201)
            .json({
                message: "Order successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server error" +err,
                success: false
            })
    }
}

export default cementOrder;