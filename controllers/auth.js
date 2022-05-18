import User from "../model/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name) throw Error("Name is required");
        if (!password || password.length < 6)
            throw Error("Password is required and should be min of 6 characters");
        let userExist = await User.findOne({ email }).exec();
        if (userExist) throw Error("Email is taken");
        const hashedPassword = await hashPassword(password);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        return res.json({ ok: true, message: 'User is saved successfully' });
    } catch (error) {
        console.log(error);
        return res.json({ ok: false, message: error.message || 'Error...Try again....' })
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email }).exec();
        if (!user) throw Error("No user found");

        const match = await comparePassword(password, user.password);

        if (!match) throw Error("Wrong Password!!!");
        //create JWT
        //expried in 7 days
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        user.password = undefined;

        //send token
        res.cookie("token", token, {
            httpOnly: true,
            //secure: true,
            //secure will only work in HTTPS
        });

        return res.json({ ok: true, user: user, message: 'Login successful' });
    } catch (error) {
        console.log(error);
        return res.json({ ok: false, message: error.message || 'Error...Try again....' })
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.json({ ok: true, message: "Logout Success..." });
    } catch (error) {
        console.log(error);
        return res.json({ ok: false, message: error.message || 'Error...Try again....' })
    }
};