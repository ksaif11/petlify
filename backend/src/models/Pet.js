import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status:{
        type:String,
        enum:["approved", "rejected", "pending"],
        default:"approved",
    },
    image: { type: String, required:true },
    createdAt: { type: Date, default: Date.now },
});

const Pet = mongoose.model("Pet", petSchema);
export default Pet;
