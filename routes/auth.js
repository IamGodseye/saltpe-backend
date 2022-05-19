import express from "express";
import { token } from "morgan";

const router = express.Router();
import {
    register,
    login,
    logout,
    profile,
    addAboutMe
} from "../controllers/auth";
import { requireSignin } from "../middleware";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", requireSignin, profile);
router.post("/about-me", requireSignin, addAboutMe);

module.exports = router;