import mongoose from 'mongoose'

const emailSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',   
        required:true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    scheduledAt:{
        type:Date,
        default:null
    },
    status:{
        type:String,
        enum:['pending','sent'],
        default:'sent'
    },
    read:{
        type:Boolean,
        default:false
    },
    trackingId:{
        type:String,
        unique:true
    }
    
},{timestamps:true});   


export const Email = mongoose.model("Email", emailSchema)