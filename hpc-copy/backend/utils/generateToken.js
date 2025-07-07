// import jwt from "jsonwebtoken";

// //userId is the payload
// const generateToken = (res, userId) => {
//     const token = jwt.sign({userId}, process.env.JWT_SECRET, {
//         expiresIn: '30d'
//     });
//     res.cookie('jwt', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV !== 'development',
//         sameSite: 'strict',
//         maxAge: 2592000000,
//     })
// }

// export default generateToken;



// import jwt from "jsonwebtoken";

// // Just return the token — don't set a cookie
// const generateToken = (userId) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });
// };

// export default generateToken;



import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token; // Optional: if you want to use it elsewhere
};

export default generateToken;
