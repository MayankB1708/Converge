import jwt from "jsonwebtoken"


//This function takes userId (to encode in JWT) and res (to set the cookie).
export const generateToken = (userId,res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"7 days"
    })

    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, // milliseconds
        httpOnly: true, //prevent XSS attacks cross-site scripting attacks
        sameSite: "strict",  //CSRF attacks across cross-site  request forgery attacks
        secure: process.env.NODE_ENV!== "development"
    })

    return token;
}