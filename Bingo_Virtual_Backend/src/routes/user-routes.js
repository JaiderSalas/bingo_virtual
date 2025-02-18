import express from "express";
import {signup , login, logout, profile, verifyToken} from "../controllers/user-controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/user.schema.js";


const router = express.Router();

router.post("/signup", validateSchema(registerSchema), signup);
router.post("/login",validateSchema(loginSchema), login);
router.post("/logout",logout);
router.get("/verify", verifyToken);
router.get("/profile",authRequired, profile);
export default router;