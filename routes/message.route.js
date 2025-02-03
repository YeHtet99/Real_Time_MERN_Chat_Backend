import express from "express";
import { getMessage, sendMessage } from "../controller/message.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();
router.post("/send/:id/:senderId", sendMessage);
router.get("/get/:id/:senderId", getMessage);

export default router;
