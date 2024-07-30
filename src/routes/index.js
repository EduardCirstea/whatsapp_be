import express from "express";
import authRoutes from "./auth.route.js";
import MessageRoutes from "./message.route.js";
import ConversationRoutes from "./conversation.router.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/conversation", ConversationRoutes);
router.use("/message", MessageRoutes);

export default router;
