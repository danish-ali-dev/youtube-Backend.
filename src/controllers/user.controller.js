import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from  "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req, res) => {
    res.status(200).json(
        { 
            message: "User registered successfully" 
        }
    )
    // user registration logic here
    const { username, email, password } = req.body;
    console.log("email:", email, "password:", password);
    // validation logic here
    if( [username, email, password].some((field) => 
        field?.trim() === "" || field === undefined)
    ) {
        throw new ApiError(400,"All fields are required");
    }
    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]  // operator whether username or password existed
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    // check Images file
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    // classic method to check image 
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ){
        coverImageLocalPath = req.files.coverImage[0].path

    }
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    

    if( !avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // upload to cloudnary
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)
   if (!avatar){
      throw new ApiError(400,"Avatar file is required")
   }
   // user object created
   const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
   })
   // remove password and reftoken field from response
   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if(!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
   }
   //response 
   return res.status(201).json(
     new ApiResponse(200, createdUser, "User registered Successfully")
    
   )
 });

export {
    registerUser,
 };