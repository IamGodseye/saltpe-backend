import express from "express";
import { requireSignin } from "../middleware";
const router = express.Router();
import {
    register,
    login,
    logout,
} from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", requireSignin, logout);

module.exports = router;