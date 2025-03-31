//Handles authentication (signup, login, logout, and profile updates).

import User from "../models/user.model.js"
import bcrypt from "bcryptjs"                   //bcryptjs to hash passwords for security
import {generateToken} from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req,res) =>{
    try{
        const {fullName, email, password} = req.body;
        
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        if(password.length<6){
            return res.status(400).json({message: "Password must be atleast 6 characters"});
        }

        const user = await User.findOne({email}); //Checks if the user already exists

        if(user){
            return res.status(400).json({message: "Email already exists"});
        }
        //Generates a salt, which is a random string of characters added to the password before hashing.
        // The 10 in genSalt(10) represents the salt rounds, which determine how complex (and secure) the salt is.
        const salt = await bcrypt.genSalt(10)  
        //Even if two users have the same password, the hashes will be different because of the unique salt.
        const hashedpassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password:hashedpassword
        })

        if(newUser){
            //generate jwt token
            generateToken(newUser._id,res)
            await newUser.save();
            

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else{
            res.status(400).json({ message: "Invalid user data"});
        }

    }catch(error){
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const login = async (req,res) =>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const isPasswordCorrect = await  bcrypt.compare(password,user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        generateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        })
    }
    catch(error){
        console.log("Error in login controller: ", error.message);
        res.status(500).json({message: " Internal Server Error"});
    }
};

export const logout = (req,res) =>{
    try{
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message: "Logged out Successfully"});
    }
    catch(error){
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({message: "Internal Server Error"});

    }
};

export const updateProfile = async (req,res) =>{
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            res.status(400).json({message: "Profile pic is required"});        
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);         //Uploads the image to Cloudinary
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new:true});  // Updates the user's profile picture in MongoDB with the new Cloudinary image URL
        res.status(200).json(updatedUser);
    }
    catch(error){
        console.log("Error in the Update Profile controller: ",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const checkAuth = async (req,res) => {
    try{
        res.status(200).json(req.user);
    }
    catch(error){
          console.log("Error in checkAuth controller: ",error.message);
          res.status(500).json({message: "Internal Server Error"});  
    }
}