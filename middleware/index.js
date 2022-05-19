import expressJwt from "express-jwt";

export const requireSignin = expressJwt({
    getToken: (req, res) => req.headers.authorization,
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});
