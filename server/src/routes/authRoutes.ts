import { Router } from "express";
import {
    register,
    login,
    refreshAccessToken,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);

export default router;