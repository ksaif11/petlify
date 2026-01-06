import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
        validate: {
            validator: function(v) {
                // Allow letters, spaces, hyphens, and apostrophes
                return /^[a-zA-Z\s'-]+$/.test(v);
            },
            message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
        }
    },
    email:{
        type:String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                // RFC 5322 compliant email regex
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please enter a valid email address'
        },
        maxlength: [100, 'Email cannot exceed 100 characters']
    },
    password:{
        type:String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [128, 'Password cannot exceed 128 characters'],
        validate: {
            validator: function(v) {
                // At least 6 characters, can contain letters, numbers, and special characters
                return /^.{6,}$/.test(v);
            },
            message: 'Password must be at least 6 characters long'
        },
        select: false // Don't return password by default in queries
    },
    isAdmin: { 
        type: Boolean, 
        default: false 
    }
}, {
    timestamps: true
})

// Add index for email lookups
userSchema.index({ email: 1 });

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password, 10);
    }
    next();
})

const User = mongoose.model("User", userSchema);

export default User;