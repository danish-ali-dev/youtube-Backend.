import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 100
  },
 fullname: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    index: true
},
 avatar: {
    type: String,  //cloudinary image URL
    default: "default-avatar.png",
    required: true
 },
 coverImage: {
    type: String,  //cloudinary image URL
    default: "default-cover.png",
 },
 watchHistory:[
    {
        type: Schema.Types.ObjectId,
        ref: "Video"
    }
 ],
 refreshTokens: {
    type: String
 }



},
{
    timestamps: true
}
)
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});
//coustom methods
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { 
            id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        }, 
        process.env.ACCESS_TOKEN_SECRET,
         { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION 
        }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { 
            id: this._id,
            
        }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION 
        }
    );
};
export const User = mongoose.model("User", userSchema); 