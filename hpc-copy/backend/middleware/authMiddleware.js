// import jwt from "jsonwebtoken";
// import asyncHandler from "express-async-handler";
// import UserLogin from "../models/userLoginModel.js";

// const protect = asyncHandler(async(req, res, next) => {
//     let token;

//     token = req.cookies.jwt;
  

//     if (token){
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await UserLogin.findById(decoded.userId).select('-password');
//             next();
//         } catch (error) {
//             res.status(401);
//             throw new Error('Invalid token')
//         }
//     } else {
//         res.status(401)
//         throw new Error('Not Authorised, no token')
//     }
// })

// export { protect };


import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserLogin from "../models/userLoginModel.js";

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // ✅ Check Authorization header first
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // ✅ Fall back to cookie if no auth header
    else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await UserLogin.findById(decoded.userId).select("-password");
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Invalid token");
    }
});

export { protect };
