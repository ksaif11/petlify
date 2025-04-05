import mongoose from "mongoose";

const adoptionRequestSchema = new mongoose.Schema({
    pet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pet",
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        enum:["pending", "approved", "rejected"],
        default:"pending",
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

const AdoptionRequest = mongoose.model("AdoptionRequest", adoptionRequestSchema);

export default AdoptionRequest;