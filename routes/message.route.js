import express from "express";
import { getMessage, sendMessage } from "../controller/message.controller.js";

const router = express.Router();
router.post("/send/:id/:senderId", sendMessage);
router.get("/get/:id/:senderId", getMessage);

export default router;
