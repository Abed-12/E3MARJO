import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    // Common fields
    type: {
        type: String,
        required: true,
        enum: ['cement', 'concrete'], // يحدد أنواع الطلبات المدعومة
    },
    recipientName:{
        type:String,
        required:true
    },
    recipientPhone:{
        type: String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    deliveryTime:{
        type: Number,
        required:true
    },
    orderRequestTime:{
        type: Number,
        required:true
    },
    status: {
        type: String,
        default: 'pending'
    },
    price: {
        type: String,
        required:true
    },
    rejectionReason:{
        type:String
    },
    // Special fields in cement
    cementQuantity:{
        type:Number,
        required: function(){
            return this.type === 'cement';
        }
    },
    cementNumberBags:{
        type:Number,
        required: function(){
            return this.type === 'cement';
        }
    },
    // Special fields in concrete

    // others
    supplierID:{
        type:String,
        required:true
    },
    companyID:{
        type:String,
        required:true
    }
});

const OrderModel = mongoose.model('order', OrderSchema);

export default OrderModel;